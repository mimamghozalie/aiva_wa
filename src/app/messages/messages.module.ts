import { WhatsappModule } from '@libs/whatsapp/whatsapp.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [WhatsappModule],
    controllers: [],
    providers: [],
})
export class MessagesModule { }
