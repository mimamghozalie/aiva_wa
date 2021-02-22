import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(private config: ConfigService) {
    }

    async signPayload(payload: any) {
        return sign(payload, this.config.get<string>('secret_key'), {
            expiresIn: this.config.get<string>('token_exp')
        })
    }

    async validateUser(payload: any) {
        return await {};
    }
}
