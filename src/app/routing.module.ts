import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';
import { PostModule } from '@app/post/post.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';
import { ApiSocketModule } from './socket.module';

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
    UserModule,
    // SocketTestModule,
    // DevicesModule, 
    MessagesModule,
    PostModule,

    ApiSocketModule
  ],
  providers: [],
})
export class AppRoutingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
