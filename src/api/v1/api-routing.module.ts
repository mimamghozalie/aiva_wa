import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';

// lib's
import { Routes, RouterModule } from 'nest-router';

// Apps Modules
import { AboutModule } from './about/about.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

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
