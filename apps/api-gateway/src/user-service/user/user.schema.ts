import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { z } from 'zod';

export const createUserSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  // refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    userName: z.string(),
    // Add other user fields as needed
  }),
});


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}
