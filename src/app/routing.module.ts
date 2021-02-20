import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { MessagesModule } from './messages/messages.module';
import { SocketTestModule } from './test/test.module';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: 'users',
        module: UserModule
      },
      {
        path: 'auth',
        module: AuthModule
      },
      // {
      //   path: 'devices',
      //   module: DevicesModule
      // },
      {
        path: 'message',
        module: MessagesModule
      }
    ],
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    SocketTestModule,
    // DevicesModule, 
    MessagesModule
  ],
})
export class AppRoutingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
