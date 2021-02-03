import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get()
  getHello(@Req() req) {
    return {
      hostname: req.headers.host,
      app_name: this.config.get('APP_NAME'),
      environtment: this.config.get('NODE_ENV'),
    };
  }
}
