import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  MessageReceived,
  WhatsAppResponse,
  WAStatus,
  WAMethod,
  newAuth,
  sendMessageParam,
  MessageAck,
  MessageResponse,
} from './whatsapp.interface';
import * as PATH from 'path';
import { writeFile, existsSync, mkdirSync, truncate } from 'fs';
import { pathBrowser } from './utils/pathBrowser';

const { Client, Chat, MessageMedia, Location } = require('whatsapp-web.js');

const logger = new Logger('WhatsApp', true)

@Injectable()
export class WhatsappService {
  private WAConnection$ = new BehaviorSubject<WAStatus[]>([]);
  public newAuth = new Subject<newAuth>();

  public onMessage = new Subject<MessageReceived>();
  public onMessageAck = new Subject<MessageAck>();


  constructor() { }

  /**
   * init Whatsapp instance
   * @param deviceId @unique
   */
  async initInstance(deviceId: string, session?: any): Promise<string | any> {
    return new Promise((resolve, reject) => {
      try {
        const WA = new Client({
          puppeteer: {
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--unhandled-rejections=strict',
            ],
            executablePath: pathBrowser(process.platform),
          },
          session,
        });
        WA.initialize();

        logger.debug(`cek device: ${deviceId}`)
        const connection = this.WAConnection$.getValue();
        if (connection.find(item => item.deviceId == deviceId) !== undefined) {
          const msg = 'Device already have connection.';
          logger.debug(msg);

          // Lempar eror koneksi sudah ada
          return reject({ error: true, message: msg });
        }
        logger.debug(`total Whatsapp connection: ${connection.length}`)
        const user: WAStatus = {
          deviceId,
          connection: WA,
        };

        // tambah koneksi
        connection.push(user);
        this.WAConnection$.next(connection);


        WA.on('authenticated', session => {

          logger.debug(session, 'AUTHENTICATED');
          connection.forEach((row, index, conn) => {
            if (row.deviceId === deviceId) {
              row.session = session;

              conn[index] = row;
            }
          });

          this.newAuth.next({
            deviceId,
            session: session,
            status: 'connected'
          });
        });

        WA.on('qr', async qr => {
          logger.debug('get qr code', 'QR CODE');
          connection.forEach((row, index, conn) => {
            if (row.deviceId === deviceId) {
              row.qrcode = qr;

              conn[index] = row;
            }
          });
          resolve(qr);
        });

        WA.on('message', async msg => {
          if (msg.from == 'status@broadcast') {
            // berjalan ketika ada yang update status di whatsapp
          } else if (msg.hasMedia) {
            let date = new Date();
            const media = await msg.downloadMedia();
            const mimeType = media.mimetype;
            let mediaType;
            if (msg.type == 'image') {
              mediaType = 'images';
            } else if (msg.type == 'sticker') {
              mediaType = 'stiker';
            } else if (msg.type == 'video') {
              mediaType = 'videos';
            }

            const fileType = mimeType.split('/').pop();
            const dir = `storage/projects/${deviceId}/${mediaType}/${date
              .getFullYear()
              .toString() +
              (date.getMonth() + 1)}`;
            // cek apakah folder ada

            if (!existsSync(dir)) {
              // buat folder
              await mkdirSync(dir, { recursive: true });
            }
            // if (msg.type == 'image') {
            const namaFile = `${dir}/${msg.id.id}.${fileType}`;
            // buat file
            writeFile(namaFile, media.data, { encoding: 'base64' }, err => {
              if (err) return console.error(err);
            });
            this.onMessage.next({
              data: msg,
              body: msg.body,
              deviceId,
              chatId: msg.to,
              msgId: msg.id.id,
              fromMe: msg.fromMe,
              type: msg.type,
              author: msg.from,
              time: new Date(msg.timestamp * 1000),
              mediaPath: namaFile,
            });
            // }
          } else if (msg.body != '') {
            /**
             * Receive message
             */

            logger.debug('receive message')
            logger.log(`${msg.from}: ${msg.body}`)
            const sender = await msg.getContact();

            this.onMessage.next({
              data: msg,
              body: msg.body,
              deviceId,
              chatId: msg.to,
              fromMe: msg.fromMe,
              type: msg.type,
              msgId: msg.id.id,
              author: msg.from,
              time: new Date(msg.timestamp * 1000),
              senderName: sender.pushname,
            });
          }
        });

        WA.on('message_ack', (msg, ack) => {
          /**
           * Receive message status
           */
          logger.log(`${msg.id.id}: ${ack}`, 'Status MSG')

          /*
              == ACK VALUES ==
              ACK_ERROR: -1
              ACK_PENDING: 0
              ACK_SERVER: 1
              ACK_DEVICE: 2
              ACK_READ: 3
              ACK_PLAYED: 4
          */
          this.onMessageAck.next({
            messageId: msg.id.id,
            ack: ack,
            msg,
            deviceId,
          });
        });

        WA.on('disconnected', async reason => {
          logger.debug(`Device disconnect: ${reason}`)
          const data = this.WAConnection$.getValue();
          data.forEach((row, index, arr) => {
            console.log(reason);
          });
        });
      } catch (error) {
        logger.error(`Fatal error Whatsapp Connection ${error.message}`)
        reject(error.message);
      }
    });
  }

  async getTotalInstance(): Promise<any> {
    return new Promise(resolve => {
      this.WAConnection$.subscribe(res => {
        resolve(
          res.map(r => {
            return {
              id: r.deviceId,
              session: r.session,
            };
          }),
        );
      });
    });
  }

  /**
   * get Qr Code by initialized Instance
   * @param deviceId @unique
   */
  async getQrCode(deviceId): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('called');
      const instance = this.WAConnection$.getValue();
      if (instance.length < 1) {
        resolve('error');
      }
      instance.forEach((row, index, arr) => {
        if (row.deviceId === deviceId) {
          console.log('found');
          return resolve(row.qrcode);
        }
        console.log('not found');
        resolve('error');
      });
    });
  }

  /**
   * Get Instance Connection
   * @param deviceId @unique
   */
  getConnection(deviceId: string): Observable<WAMethod> {
    return this.WAConnection$.pipe(
      map(users => {
        logger.debug(`Get connection: ${deviceId}`)
        return users.find(u => u.deviceId === deviceId).connection || null;
      }),
    );
  }

  async instanceDestroy(deviceId: string): Promise<string | any> {
    return new Promise(async (resolve, reject) => {
      const connection = this.WAConnection$.getValue();

      const instance = connection.findIndex(i => i.deviceId == deviceId)

      if (instance !== -1) {
        // instance ada
        logger.debug('Instance found')
        logger.debug('Destroying instance...')
        await connection[instance].connection.destroy()
        logger.debug('Instance Destroyed.')

        try {
          logger.log('Remove Instance')
          connection.splice(instance, 1)
          logger.log('Instance removed')
          logger.debug('Update Instance Connection')
          this.WAConnection$.next(connection);

          return "Instance Removed"
        } catch (error) {
          logger.error(`Error destroy instance: ${error.message}`)
          return Promise.reject({ error: true, message: 'Error destroy instance' })
        }
      }
      return reject({ error: true, message: 'instance not found' })

    })
  }

  async sendMessage(
    deviceId,
    phone: string,
    msg: any,
  ): Promise<MessageResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        return this.getConnection(deviceId).subscribe(async (client: any) => {
          if (!client) {
            resolve({
              message: 'Device Not Connected',
              error: true
            })
          }

          resolve({
            error: false,
            data: await client.sendMessage(phone + '@c.us', msg)
          })

        })
      } catch (error) {
        reject({
          error: true,
          message: error.message
        })
      }
    })
  }

  async sendMedia(param: sendMessageParam) {
    const { deviceId, mediaPath, phone, caption, type } = param;
    return new Promise((resolve, reject) => {
      this.getConnection(deviceId).subscribe((res: any) => {
        if (!res) {
          return resolve({
            error: true,
            message: 'Connection Refused',
          });
        }

        let media = MessageMedia.fromFilePath(
          PATH.resolve(process.cwd(), mediaPath),
        );
        res
          .sendMessage(phone, media)
          .then(wares => {
            console.log(wares);
            resolve(wares);
          })
          .catch(err => {
            console.log(err);
            resolve(err);
          });
      });
    });
  }

  async getProfile(deviceId) {
    return this.getConnection(deviceId).pipe(map((res: any) => res.info));
  }

  async getContacts(deviceId: string, contactId?: string) {
    return new Promise(async (resolve, reject) => {
      this.getConnection(deviceId).subscribe((res: any) => {
        if (!res) {
          return resolve({
            error: true,
            message: 'Connection Refused',
          });
        }

        if (contactId) {
          return res
            .getContactById(contactId)
            .then(async res => {
              resolve({
                ...res,
                picture: await res.getProfilePicUrl(),
              });
            })
            .catch(err => {
              resolve({ error: true, err });
            });
        }
        res.getContacts().then(contacts => {
          resolve(contacts);
        });
      });
    });
  }

  async getChat(deviceId) {
    return new Promise((resolve, reject) => {
      this.getConnection(deviceId).subscribe(async res => {
        if (!res) {
          return resolve({
            error: true,
            message: 'Connection Refused',
          });
        }
        const data = await res.getChats();
        resolve(data);
      });
    });
  }

  async getChatById(deviceId, phone, limit?: number): Promise<WhatsAppResponse> {
    return new Promise(async (resolve, reject) => {
      console.log(phone, deviceId);
      this.getConnection(deviceId).subscribe(async res => {
        if (!res) {
          return resolve({
            error: true,
            message: 'Connection Refused',
          });
        }

        try {
          const data: any = await res.getChatById(phone);
          if (!data) {
            return resolve({
              error: true,
              message: 'Phone not registered.',
            });
          }

          const chat = await data.fetchMessages({ limit });
          chat.map(r => {
            if (r.hasMedia) {
              r.imageUrl = `storage/projects/${deviceId}/${r.id.id}.png`;
              return r;
            }
          });
          resolve(chat);
        } catch (error) {
          resolve({
            error: true,
            message: 'No Message',
          });
        }
      });
    });
  }
}
