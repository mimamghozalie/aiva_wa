import * as Joi from 'joi';

export const Config = Joi.object({
  APP_NAME: Joi.string().default('AIVA'),
  NODE_ENV: Joi.string()
    .valid(
      'development',
      'production',
      'test',
      'provision',
      'staging',
      'heroku',
    )
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_TYPE: Joi.string().default('postgres'),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),

  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/aiva'),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASS: Joi.string().optional(),

  // Throttler
  THROTTLE_TTL: Joi.number().default(60), // the number of seconds that each request will last in storage
  THROTTLE_LIMIT: Joi.number().default(10), //the maximum number of requests within the TTL limit
});
