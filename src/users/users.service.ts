/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { BaseResponse } from 'src/shared/base-output.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginOutputDto } from './dto/login-output.dto';
import { ObjectId } from 'mongodb';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/seed/schemas/category.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User?.name) private userModel: Model<User>,
    @InjectModel(Category?.name) private categoryModel: Model<Category>,
    private jwtService: JwtService,
  ) {}

  async register(input: CreateUserDto): Promise<BaseResponse> {
    const oldUser = await this.getUserByEmail(input?.email);
    if (oldUser) {
      throw new ConflictException('User already exist');
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const createdUser = new this.userModel({
      ...input,
      password: hashedPassword,
      categories: input?.categories ?? [],
    });
    let output: BaseResponse = { message: '', id: '' };
    await createdUser
      .save()
      .then((data: any) => {
        output = { message: 'User Created Successfully', id: data?.id };
        return output;
      })
      .catch((err: any) => {
        output = { message: err?.message, id: '' };
        return output;
      });
    return output;
  }
  async getUserByEmail(email: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email: email })
      .populate('categories')
      .exec();
    return user;
  }
  async login(input: LoginUserDto): Promise<LoginOutputDto> {
    const user = await this.getUserByEmail(input?.email);
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    const validatePassword = await bcrypt.compare(
      input?.password,
      user.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('User Credentials not correct');
    }
    const payload = {
      email: user.email,
      sub: user._id,
      categories: user?.categories,
      name: user?.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async updateProfile(
    ctx: any,
    input: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<BaseResponse> {
    const { sub } = ctx?.user;
    if (file) {
      input.image = `/uploads/${file?.filename}`;
    }
    if (input?.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    const userInput = plainToClass(User, { ...input });
    const existingUser = await this.userModel
      .findByIdAndUpdate({ _id: new ObjectId(sub) }, userInput, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${sub} not found`);
    }
    return {
      message: 'Profile Updated Successfully',
      id: existingUser?._id?.toString(),
    };
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find();
    return categories;
  }

  async getUserProfile(ctx: any): Promise<User> {
    const user = await this.userModel
      .findOne({ email: ctx?.user?.email })
      .populate({ path: 'categories', select: 'name' })
      .exec();
    if (user?.image) {
      user.image = `http://127.0.0.1:4000${user?.image}`;
    }
    user.password = '';
    return user;
  }
}
