import { Controller, Post, Body, UsePipes, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createUserSchema, CreateUserDto } from './user.schema';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('API Gateway: Forwarding user creation request to user-service...');
    return this.userService.send({ cmd: 'create_user' }, createUserDto);
  }
}
