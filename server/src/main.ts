import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Environment } from './config/config.options'

async function bootstrap() {
  /** Creating application */
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  /** Our environment config service */
  const configService: ConfigService<Environment> = app.get(ConfigService)

  /** Enabling CORS */
  app.enableCors({ origin: '*', exposedHeaders: 'content-disposition' })

  /** Enabling validation in app */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const port = configService.get<number>('PORT')

  await app.listen(port)
}
bootstrap()
