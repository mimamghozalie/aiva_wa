import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// libs
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

// Apps
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStragegy extends PassportStrategy(Strategy) {

    constructor(
        private config: ConfigService,
        private authService: AuthService

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('secret_key')
        })
    }

    async validate(payload: any, done: VerifiedCallback) {

        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException())
        }
        return done(null, user, payload.iat)
    }
}