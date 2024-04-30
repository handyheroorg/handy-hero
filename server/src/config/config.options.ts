import { ConfigModuleOptions } from '@nestjs/config'
import * as joi from 'types-joi'
import { InterfaceFrom } from 'types-joi'

export enum NodeEnv {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
}

const validationSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid(...Object.values(NodeEnv))
      .required(),
    PORT: joi.number().integer().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    NOVU_API_KEY: joi.string().required(),
    FRONTEND_BASE_URL: joi.string().required(),
    AWS_ACCESS_KEY: joi.string().required(),
    AWS_ACCESS_SECRET: joi.string().required(),
    AWS_BUCKET_NAME: joi.string().required(),
    SQUARE_ACCESS_TOKEN: joi.string().required(),
    SQUARE_LOCATION_ID: joi.string().required(),
  })
  .required()

export type Environment = InterfaceFrom<typeof validationSchema>

const configOptions: ConfigModuleOptions = {
  envFilePath: ['.env', '.env.development', '.env.production'],
  isGlobal: true,
  validationSchema,
}

export default configOptions
