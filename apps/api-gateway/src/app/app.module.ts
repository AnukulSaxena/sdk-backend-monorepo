import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { JwtAuthGuard } from '../auth/jwt.guard';
import * as Joi from 'joi'; // For environment variable validation
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env', // Specific .env for this app
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        USER_SERVICE_URL: Joi.string().uri().required(),
        AUTH_SERVICE_URL: Joi.string().uri().required(), // For future Auth Service integration
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key', // Use environment variable
      signOptions: { expiresIn: '15m' }, // Matches auth service access token
    }),
    HttpModule, // For making HTTP requests to other services
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // You can apply guards globally or per controller/method
  // For a real API Gateway, you'd have more sophisticated routing
}
