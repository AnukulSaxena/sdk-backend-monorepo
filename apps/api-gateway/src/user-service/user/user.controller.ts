import { Controller, Post, Body, Inject, Res, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginResponseSchema, LoginUserDto } from './user.schema';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('API Gateway: Forwarding user creation request to user-service...');
    return this.userService.send({ cmd: 'create_user' }, createUserDto);
  }


  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    console.log('API Gateway: Forwarding user login request to user-service...');
    const result = await lastValueFrom(this.userService.send({ cmd: 'login_user' }, loginUserDto));

    const { accessToken, user  } = LoginResponseSchema.parse(result);

    
    // Set the access token in a secure HTTP-only cookie

     res.cookie('access_token', accessToken, {
      httpOnly: true,       // Prevents client-side JS from accessing the cookie (XSS protection)
      secure: process.env.NODE_ENV !== 'development', // Ensures cookie is sent over HTTPS only
      sameSite: 'strict',   // 'strict' or 'lax' for CSRF protection
      path: '/',            // The cookie is available for all paths
      maxAge: 3600000,      // Cookie expiration time in milliseconds (e.g., 1 hour)
    });


    // Set the refresh token in a secure HTTP-only cookie
    // res.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,       // Prevents client-side JS from accessing the cookie (XSS protection)
    //   secure: process.env.NODE_ENV !== 'development', // Ensures cookie is sent over HTTPS only
    //   sameSite: 'strict',   // 'strict' or 'lax' for CSRF protection
    //   path: '/',            // The cookie is available for all paths
    //   maxAge: 72000000,      // Cookie expiration time in milliseconds (e.g., 20 hours)
    // });

    return { status: 'success', message: 'Logged in successfully', data: { user , accessToken} };
  }
}
