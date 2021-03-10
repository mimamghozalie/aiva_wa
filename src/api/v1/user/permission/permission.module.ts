import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Module({
  controllers: [],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule { }
