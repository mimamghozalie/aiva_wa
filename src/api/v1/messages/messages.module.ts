import { Module } from '@nestjs/common';

// libs
import { TypeOrmModule } from '@nestjs/typeorm';

// apps
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule { }
