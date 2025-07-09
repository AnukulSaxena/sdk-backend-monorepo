import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ $or: [{ userName: createUserDto.userName }, { email: createUserDto.email }] }).exec();

    if (existingUser) {
      throw new ConflictException('User with this username or email already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}
