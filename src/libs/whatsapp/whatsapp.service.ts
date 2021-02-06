import { Injectable } from '@nestjs/common';
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
import { writeFile, existsSync, mkdirSync } from 'fs';

const { Client, Chat, MessageMedia, Location } = require('whatsapp-web.js');

@Injectable()
export class WhatsappService {
  private WAConnection$ = new BehaviorSubject<WAStatus[]>([]);
  public newAuth = new Subject<newAuth>();

  public onMessage = new Subject<MessageReceived>();
  public onMessageAck = new Subject<MessageAck>();
  constructor() { }

  /**
   * init Whatsapp instance
   * @param userId @unique
   */
  async initInstance(userId: string, session?: any): Promise<string> {
    return new Promise((res, rej) => {
      try {
        const pathWin = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
        const WA = new Client({
          puppeteer: {
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--unhandled-rejections=strict',
            ],
            executablePath: pathWin,
          },
          session,
        });
        WA.initialize();
        const connection = this.WAConnection$.getValue();
        const user: WAStatus = {
          id: userId,
          connection: WA,
        };
        connection.push(user);
        this.WAConnection$.next(connection);
        WA.on('authenticated', session => {
          console.log('authed', session);

          connection.forEach((row, index, conn) => {
            if (row.id === userId) {
              row.session = session;

              conn[index] = row;
            }
          });

          this.newAuth.next({
            id: userId,
            session: session,
            status: 'connected'
          });
        });

        WA.on('qr', async qr => {
          console.log('update qr');
          connection.forEach((row, index, conn) => {
            if (row.id === userId) {
              row.qrcode = qr;

              conn[index] = row;
            }
          });
          res(qr);
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
            const dir = `storage/projects/${userId}/${mediaType}/${date
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
              userId,
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
            const sender = await msg.getContact();
            // jika pesan masuk tidak kosong

            this.onMessage.next({
              data: msg,
              body: msg.body,
              userId,
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
            userId,
          });
        });

        WA.on('disconnected', async reason => {
          console.log(reason);
          const data = this.WAConnection$.getValue();
          data.forEach((row, index, arr) => {
            console.log(reason);
          });
        });
      } catch (error) {
        console.error(`Fatal error Whatsapp Connection ${error.message}`)
        rej(error.message);
      }
    });
  }

  async getTotalInstance(): Promise<any> {
    return new Promise(resolve => {
      this.WAConnection$.subscribe(res => {
        resolve(
          res.map(r => {
            return {
              id: r.id,
              session: r.session,
            };
          }),
        );
      });
    });
  }

  /**
   * get Qr Code by initialized Instance
   * @param userId @unique
   */
  async getQrCode(userId): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('called');
      const instance = this.WAConnection$.getValue();
      if (instance.length < 1) {
        resolve('error');
      }
      instance.forEach((row, index, arr) => {
        if (row.id === userId) {
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
        // console.log(users);
        // console.log(users.find(u => u.id === deviceId).connection)
        return users.find(u => u.id === deviceId).connection;
      }),
    );
  }

  async instanceDestroy(deviceId: string): Promise<void> {
    try {
      const instance = this.WAConnection$.getValue();

      instance.forEach(async (row, index) => {
        if (row.id == deviceId) {
          try {
            const connection = row.connection;
            // await connection.logout();
            await connection.destroy();

            instance.splice(index, 1);
          } catch (error) {
            console.error('instance destroy catch', error);
          }
        }
      });

      this.WAConnection$.next(instance);
    } catch (error) {
      console.log('error close', error);
    }
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
    const { userId, mediaPath, phone, caption, type } = param;
    return new Promise((resolve, reject) => {
      this.getConnection(userId).subscribe((res: any) => {
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

  async getProfile(userId) {
    return this.getConnection(userId).pipe(map((res: any) => res.info));
  }

  async getContacts(userId: string, contactId?: string) {
    return new Promise(async (resolve, reject) => {
      this.getConnection(userId).subscribe((res: any) => {
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

  async getChat(userId) {
    return new Promise((resolve, reject) => {
      this.getConnection(userId).subscribe(async res => {
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

  async getChatById(userId, phone, limit?: number): Promise<WhatsAppResponse> {
    return new Promise(async (resolve, reject) => {
      console.log(phone, userId);
      this.getConnection(userId).subscribe(async res => {
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
              r.imageUrl = `storage/projects/${userId}/${r.id.id}.png`;
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
