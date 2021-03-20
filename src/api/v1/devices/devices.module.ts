import { forwardRef, Module } from '@nestjs/common';

// libs
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappModule } from '@libs/whatsapp/whatsapp.module';

// apps
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device } from './entities/device.entity';
import { UserModule } from '../user/user.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    UserModule,
    forwardRef(() => MessagesModule),
    WhatsappModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService]
})
export class DevicesModule { }
