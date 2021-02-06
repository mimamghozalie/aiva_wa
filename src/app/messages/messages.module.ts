import { WhatsappModule } from '@libs/whatsapp/whatsapp.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './messages.controller';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';

@Module({
    imports: [WhatsappModule, TypeOrmModule.forFeature([MessagesEntity])],
    controllers: [MessageController],
    providers: [MessagesService],
})
export class MessagesModule { }
