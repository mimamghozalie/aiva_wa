import { Controller, Get } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) { }

  @Get()
  async about() {
    return {
      status: 'ok',
      error: {},
      details: {
        "users": {
          status: 'ok'
        }
      },
      info: {
        "status": "ok",
        deprecated: '2022-01-01'
      }
    }
  }
}
