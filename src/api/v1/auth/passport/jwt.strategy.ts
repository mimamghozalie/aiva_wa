import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// libs
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

@Injectable()
export class JwtStragegy extends PassportStrategy(Strategy) {

    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('secret_key')
        })
    }

    async validate(payload: any, done: VerifiedCallback) {

        return done(null, { wo: 'user' }, payload.iat)
    }
}