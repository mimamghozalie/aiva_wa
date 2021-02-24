import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';

// lib's
import { Routes, RouterModule } from 'nest-router';

// Apps Modules
import { PermissionModule } from '../permission/permission.module';


export const routes: Routes = [
  {
    path: 'api/v1/user/permission',
    module: PermissionModule
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    PermissionModule
  ],
  providers: [],
})
export class PermissionRoutingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      // .with({ path: '/' } as Route)
      .forRoutes('/');
  }
}
