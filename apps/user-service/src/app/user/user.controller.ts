import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() createUserDto: CreateUserDto) {

    // Log the incoming data for debugging purposes
    console.log('User Service: Creating user withsdf data:', createUserDto);
    return this.userService.createUser(createUserDto);
    
  }
}
