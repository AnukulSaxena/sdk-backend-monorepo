import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from './schemas/auth.schema';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateAccessToken(user: UserDocument): Promise<string> {
    const payload = { userId: user._id, email: user.email };
    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET'
    );
    if (!accessTokenSecret) {
      throw new RpcException({
        message: 'JWT access token secret is not configured',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // Internal Server Error
      });
    }

    return this.jwtService.signAsync(payload, {
      secret: accessTokenSecret,
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '1h',
    });
  }

  async loginUser(data: LoginUserDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404, // Not Found
      });
    }
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new RpcException({
        message: 'Invalid password',
        statusCode: 401, // Unauthorized
      });
    }

    // If you have JWT or session logic, you can add it here
    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        // Add other user fields as needed
      },
    };
  }
}
