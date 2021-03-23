import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

// 3rd party module
import * as compression from 'compression';
import * as helmet from 'helmet';

// app module
import { AppModule } from './app.module';

const { SSL, NODE_ENV, PORT, DOMAIN, APP_NAME } = process.env;
const PROD = NODE_ENV === 'production' ? true : false;

// add config
let appOpt = {};

let httpsOptions = null;
if (SSL == 'ON') {
  httpsOptions = {
    key: readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`, 'utf8'),
    cert: readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`, 'utf8'),
    ca: readFileSync(`/etc/letsencrypt/live/${DOMAIN}/chain.pem`, 'utf8')
  }
}

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      ...appOpt,
      logger: (PROD ? ['error'] : false),
      httpsOptions
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
    } else {
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
      `[${NODE_ENV.toUpperCase()}] run at http${SSL == 'TRUE' ? 's' : ''}://localhost:${PORT}`,
      `${APP_NAME}`, true
    );
  } catch (error) {
    Logger.error(error.message, error.stack, 'Bootstrap');
  }
}
bootstrap();
