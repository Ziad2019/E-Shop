import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as mongoSanitize from 'express-mongo-sanitize';

async function bootstrap() {
   
  const app = await NestFactory.create(AppModule,{cors:true});
  

app.use(mongoSanitize());
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
