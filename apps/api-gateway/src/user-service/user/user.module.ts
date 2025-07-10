import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
        ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          // Use environment variables for host and port!
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT, 10) || 4000,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [],
  exports: [ClientsModule], // Export ClientsModule for use in other modules
})
export class UserModule {}
