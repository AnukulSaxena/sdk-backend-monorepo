import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/Exception/ExceptionFilters';

async function bootstrap() {
  // Use 'createMicroservice' to create a service that listens for messages
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT, 10) || 3001,
    },
  });
  // // The microservice listen() method doesn't take a port argument
  // app.useGlobalPipes(new ValidationPipe())
  //   app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }));
  await app.listen();

  console.log('🚀 User service is running and listening for TCP messages');
}
bootstrap();