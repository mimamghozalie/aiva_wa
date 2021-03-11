import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

// 3rd party module
import * as compression from 'compression';
import * as helmet from 'helmet';

// app module
import { AppModule } from './app.module';

const { SSL, SSL_CERT, SSL_KEY, NODE_ENV, PORT } = process.env;
const PROD = NODE_ENV === 'production' ? true : false;

// add config
let appOpt = {};

if (SSL != 'FALSE') {
  appOpt = {
    ...appOpt,
    httpsOptions: {
      key: readFileSync(SSL_KEY, 'utf8'),
      cert: readFileSync(SSL_CERT, 'utf8'),
    },
  };
}

appOpt = PROD ? { ...appOpt, logger: false } : { ...appOpt };

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      ...appOpt,
    });

    // const configService = app.get(ConfigService);

    // static folder
    app.useStaticAssets('storage', {
      prefix: '/storage/',
    });

    // app.useGlobalFilters(new ErrorFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        disableErrorMessages: PROD,
      }),
    );

    if (!PROD) {
      // CORS security
      app.enableCors();

      // compression
      app.use(compression());

      /**
       * SECURITY
       */
      app.use(helmet());

      // When there is a load balancer or reverse proxy between the server and the internet, Express may need to be configured to trust the headers set by the proxy in order to get the correct IP for the end user.
      app.set('trust proxy', 1);
    }

    await app.listen(PORT);
    Logger.log(
      `[Aiva] running on http${SSL == 'TRUE' ? 's' : ''}://localhost:${PORT}`,
      'Bootstrap',
    );
  } catch (error) {
    Logger.error(error.message, error.stack, 'Bootstrap');
  }
}
bootstrap();
