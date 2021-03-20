import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

// lib's
import { Routes, RouterModule } from 'nest-router';

// Apps Modules
import { ResponseInterceptor } from '@api/middleware/response.interceptor';
import { AboutModule } from './about/about.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DevicesModule } from './devices/devices.module';
import { MessagesModule } from './messages/messages.module';

export const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: 'about',
        module: AboutModule
      },
      {
        path: 'auth',
        module: AuthModule
      },
      {
        path: 'users',
        module: UserModule,
      },
      {
        path: 'devices',
        module: DevicesModule
      },
      {
        path: 'messages',
        module: MessagesModule
      }
    ],
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AboutModule,
    AuthModule,
    UserModule,
    DevicesModule,
    MessagesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ],
})
export class ApiRoutingV1Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
