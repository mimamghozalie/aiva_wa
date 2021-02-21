import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';

// lib's
import { Routes, RouterModule } from 'nest-router';

// Apps Modules
import { AboutModule } from './about/about.module';

export const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: 'about',
        module: AboutModule
      },
    ],
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AboutModule
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
