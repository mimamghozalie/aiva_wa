import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
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
      {
        path: 'devices',
        module: DevicesModule
      }
    ],
  },
];

@Module({
  imports: [RouterModule.forRoutes(routes), SocketTestModule, DevicesModule],
})
export class AppRoutingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
