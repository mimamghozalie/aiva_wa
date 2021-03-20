import { forwardRef, Module } from '@nestjs/common';

// libs
import { TypeOrmModule } from '@nestjs/typeorm';

// apps
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { DevicesModule } from '../devices/devices.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => DevicesModule)],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule { }
