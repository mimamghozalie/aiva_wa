import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';

// lib's
import { Routes, RouterModule } from 'nest-router';

// Apps Modules
import { AboutModule } from './about/about.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './user/role/role.module';
import { PermissionModule } from './user/permission/permission.module';

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
        path: 'user',
        module: UserModule
      },
      {
        path: 'role',
        module: RoleModule
      },
      {
        path: 'permission',
        module: PermissionModule
      }
    ],
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AboutModule,
    AuthModule,
    UserModule
  ],
  providers: [],
})
export class ApiRoutingV1Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
