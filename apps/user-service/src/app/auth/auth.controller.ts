import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto } from './schemas/auth.schema';

@Controller()
export class AuthController {
      constructor(private readonly authservice: AuthService) {}
    
      @MessagePattern({ cmd: 'login_user' })
      async loginUser(@Payload() loginUserDto: LoginUserDto) {

        // Log the incoming data for debugging purposes
        console.log('User Service: Logging in user with data:', loginUserDto);
        return this.authservice.loginUser(loginUserDto);
        
      }
}
