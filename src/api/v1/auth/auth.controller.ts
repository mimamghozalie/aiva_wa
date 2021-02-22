import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


// Apps
import { UserService } from '@api/v1/user/user.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService

  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async hi() {
    return {
      status: 'ok'
    }
  }

  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    const user = await this.userService.findByLogin(body);
    const { fullname, phone, email, id } = user;
    const payload = { fullname, id };
    const token = await this.authService.signPayload(payload);

    return {
      ...payload,
      token
    }
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    const user = await this.userService.create(body);
    const { fullname, phone, id } = user;
    const payload = { fullname, id };
    const token = await this.authService.signPayload(payload);

    return {
      ...payload,
      token
    }
  }
}
