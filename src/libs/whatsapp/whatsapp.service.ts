import { Injectable, Logger } from '@nestjs/common';
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


@Injectable()
export class WhatsappService {
  logger = new Logger(WhatsappService.name, true)


  private instances$ = new BehaviorSubject<WAStatus[]>([]);
  public readonly instance = new Subject<newAuth>();

  public readonly onMessage = new Subject<MessageReceived>();
  public readonly onMessageAck = new Subject<MessageAck>();


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

        this.logger.debug(`cek device: ${deviceId}`)
        const instances = this.instances$.getValue();
        if (instances.find(item => item.deviceId == deviceId) !== undefined) {
          this.logger.log(`Instance already: ${deviceId}`);

          // Lempar eror koneksi sudah ada
          return reject({ error: true, message: "Instance is Available." });
        }

        /**
         * Buat instance baru
         */
        this.logger.debug(`Total instance: ${instances.length}`)
        const newInstance: WAStatus = {
          deviceId,
          connection: WA,
        };

        // tambah koneksi
        instances.push(newInstance);
        this.instances$.next(instances);


        WA.on('authenticated', session => {

          this.logger.debug(`AUTH ok : ${deviceId}`);
          instances.forEach((row, index, conn) => {
            if (row.deviceId === deviceId) {
              row.session = session;
              row.status = 'connected';
              conn[index] = row;
            }
          });
          this.instances$.next(instances)
          // 
          this.instance.next({
            deviceId,
            session: session,
            status: 'connected'
          });
        });

        WA.on('qr', async qr => {
          this.logger.debug(`GET qr code: ${deviceId}`);
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

            this.logger.debug('receive message')
            this.logger.log(`${msg.from}: ${msg.body}`)
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
          this.logger.log(`${msg.id.id}: ${ack}`, 'Status MSG')

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
          this.logger.debug(`Device disconnect: ${reason}`)
          const data = this.instances$.getValue();
          data.forEach((row, index, arr) => {
            console.log(reason);
          });
        });
      } catch (error) {
        this.logger.error(`Fatal error Whatsapp Connection ${error.message}`)
        reject(error.message);
      }
    });
  }

  async getTotalInstance(): Promise<any> {
    return this.instances$.getValue()
  }

  /**
 * Get Instance Connection
 * @param userId @unique
 */
  getConnection(deviceId): Observable<WAMethod> {
    return this.instances$.pipe(
      map(users => {
        const user = users.find(user => user.deviceId === deviceId);
        if (user) {
          return user.connection;
        }
        return null;
      }),
    );
  }

  /**
   * Get Instance Connection
   * @param deviceId @unique
   */
  getInstance(deviceId?: string): WAStatus | WAStatus[] | null {
    if (deviceId) {
      return this.instances$.getValue().find(i => i.deviceId === deviceId) || null;
    }
    return this.instances$.getValue();
    // return this.WAConnection$.pipe(
    //   map(users => {
    //     this.logger.debug(`Get connection: ${deviceId}`)
    //     return users.find(u => u.deviceId === deviceId)?.connection || null;
    //   }),
    // );
  }

  async instanceDestroy(deviceId: string): Promise<string | any> {
    return new Promise(async (resolve, reject) => {

      const instance = this.getInstance(deviceId)
      console.log(instance)

      if (instance === null) {
        // instance ada
        this.logger.log('Destroying instance...')
        // await instance?.connection?.destroy()
        // this.logger.debug('Instance Destroyed.')

        // try {
        // this.logger.log('Remove Instance')
        //   this.instances$.splice(instance, 1)
        //   this.logger.log('Instance removed')
        //   this.logger.debug('Update Instance Connection')
        //   this.WAConnection$.next(connection);

        //   resolve("Instance Removed")
        // } catch (error) {
        //   this.logger.error(`Error destroy instance: ${error.message}`)
        //   reject({ error: true, message: 'Error destroy instance' })
        // }
      }
      reject({ error: true, message: 'instance not found' })

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
          console.log(`kirim pesan ke ${deviceId}`)
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

  // async sendMedia(param: sendMessageParam) {
  //   const { deviceId, mediaPath, phone, caption, type } = param;
  //   return new Promise((resolve, reject) => {
  //     this.getConnection(deviceId).subscribe((res: any) => {
  //       if (!res) {
  //         return resolve({
  //           error: true,
  //           message: 'Connection Refused',
  //         });
  //       }

  //       let media = MessageMedia.fromFilePath(
  //         PATH.resolve(process.cwd(), mediaPath),
  //       );
  //       res
  //         .sendMessage(phone, media)
  //         .then(wares => {
  //           console.log(wares);
  //           resolve(wares);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //           resolve(err);
  //         });
  //     });
  //   });
  // }

  // async getProfile(deviceId) {
  //   const instance = this.getInstance(deviceId);
  //   return instance?.connection.info()
  // }

  // async getContacts(deviceId: string, contactId?: string) {
  //   return new Promise(async (resolve, reject) => {
  //     this.getConnection(deviceId).subscribe((res: any) => {
  //       if (!res) {
  //         return resolve({
  //           error: true,
  //           message: 'Connection Refused',
  //         });
  //       }

  //       if (contactId) {
  //         return res
  //           .getContactById(contactId)
  //           .then(async res => {
  //             resolve({
  //               ...res,
  //               picture: await res.getProfilePicUrl(),
  //             });
  //           })
  //           .catch(err => {
  //             resolve({ error: true, err });
  //           });
  //       }
  //       res.getContacts().then(contacts => {
  //         resolve(contacts);
  //       });
  //     });
  //   });
  // }

  // async getChat(deviceId) {
  //   return new Promise((resolve, reject) => {
  //     this.getConnection(deviceId).subscribe(async res => {
  //       if (!res) {
  //         return resolve({
  //           error: true,
  //           message: 'Connection Refused',
  //         });
  //       }
  //       const data = await res.getChats();
  //       resolve(data);
  //     });
  //   });
  // }

  // async getChatById(deviceId, phone, limit?: number): Promise<WhatsAppResponse> {
  //   return new Promise(async (resolve, reject) => {
  //     console.log(phone, deviceId);
  //     this.getConnection(deviceId).subscribe(async res => {
  //       if (!res) {
  //         return resolve({
  //           error: true,
  //           message: 'Connection Refused',
  //         });
  //       }

  //       try {
  //         const data: any = await res.getChatById(phone);
  //         if (!data) {
  //           return resolve({
  //             error: true,
  //             message: 'Phone not registered.',
  //           });
  //         }

  //         const chat = await data.fetchMessages({ limit });
  //         chat.map(r => {
  //           if (r.hasMedia) {
  //             r.imageUrl = `storage/projects/${deviceId}/${r.id.id}.png`;
  //             return r;
  //           }
  //         });
  //         resolve(chat);
  //       } catch (error) {
  //         resolve({
  //           error: true,
  //           message: 'No Message',
  //         });
  //       }
  //     });
  //   });
  // }
}
