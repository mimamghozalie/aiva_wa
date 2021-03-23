import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappServiceV2 } from './whatsappv2.service';

@Module({
  providers: [WhatsappService, WhatsappServiceV2],
  exports: [WhatsappService, WhatsappServiceV2],
})
export class WhatsappModule { }
