import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { UserService } from '@api/v1/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private config: ConfigService,
        private userService: UserService
    ) { }

    async signPayload(payload: any) {
        return await sign(payload, this.config.get('secret_key'), {
            expiresIn: this.config.get('token_exp')
        })
    }

    async validateUser(payload: any) {
        return await this.userService.findByPayload(payload);
    }
}
