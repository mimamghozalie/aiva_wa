import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

// libs
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// system
import { SystemConfigModule } from '@system/config/config.module';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [SystemConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ttl: config.get('THROTTLE_TTL'),
                limit: config.get('THROTTLE_LIMIT'),
            }),
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        }
    ]
})
export class SystemThrottlerModule { }
