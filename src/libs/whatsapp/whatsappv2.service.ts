import { Injectable, Logger } from "@nestjs/common";
import { BehaviorSubject } from "rxjs";
import { pathBrowser } from "./utils/pathBrowser";
import { WAStatus } from "./whatsapp.interface";
const { Client, Chat, MessageMedia, Location } = require('whatsapp-web.js');


@Injectable()
export class WhatsappServiceV2 {

    logger = new Logger(WhatsappServiceV2.name, true)
    private instances$ = new BehaviorSubject<WAStatus[]>([]);

    constructor(

    ) { }

    /**
     * init Whatsapp instance
     * @param deviceId @unique
     */
    async startInstance(deviceId: string, session?: any): Promise<string | any> {
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
                console.log(instances)
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
                    status: "creating"
                };

                // tambah koneksi
                instances.push(newInstance);
                // save to observable
                this.instances$.next(instances);


                WA.on('authenticated', session => {
                    instances.forEach((row, i) => {
                        console.log(row['deviceId'], row['status'])
                    })
                    this.logger.debug(`Instance ready: ${deviceId}`);
                    instances.forEach((row, index, conn) => {
                        if (row.deviceId === deviceId) {
                            row.session = session;
                            row.status = 'connected';
                            conn[index] = row;
                        }
                    });
                    instances.forEach((row, i) => {
                        console.log(row['deviceId'], row['status'])
                    })
                    this.instances$.next(instances)

                    const instance: any = this.getInstance(deviceId)
                    console.log(instance.status)
                    if (instance.status == 'connected') {
                        instance.connection.sendMessage('6281357377733@c.us', 'hi from direct').then(console.log).catch(console.error)
                    }
                });

                WA.on('qr', async qr => {
                    this.logger.debug(`GET qr code: ${deviceId}`);
                    resolve(qr);
                });

                WA.on('disconnected', async reason => {
                    this.logger.debug(`Device disconnect: ${reason}`)
                    console.log(reason);
                    // const data = this.instances$.getValue();
                    // data.forEach((row, index, arr) => {
                    // });
                });
            } catch (error) {
                this.logger.error(`Instance error: ${deviceId} ${error.message}`)
                reject(error.message);
            }
        });
    }


    getInstance(deviceId?: string): WAStatus | WAStatus[] | null {
        if (deviceId) {
            return this.instances$.getValue().find(i => i.deviceId === deviceId) || null;
        }
        return this.instances$.getValue();
    }
}