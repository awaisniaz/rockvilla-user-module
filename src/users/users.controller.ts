import {
  Controller,
  Post,
  Body,
  Patch,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { BaseResponse } from 'src/shared/base-output.dto';
import { NotFoundError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { RequestContext } from './context-initiator/Request-Context';
import { LoginOutputDto } from './dto/login-output.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Category } from 'src/seed/schemas/category.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: NotFoundError,
  })
  async register(@Body() input: CreateUserDto): Promise<BaseResponse> {
    return await this.usersService.register(input);
  }

  @Post('login')
  login(@Body() input: LoginUserDto): Promise<LoginOutputDto> {
    return this.usersService.login(input);
  }

  @Patch('update-Profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  updateProfile(
    @RequestContext() ctx: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(ctx, updateUserDto, file);
  }

  @Get('get-categories')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getCategories(): Promise<Category[]> {
    return this.usersService.getCategories();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUserProfile(@RequestContext() ctx: any) {
    return this.usersService.getUserProfile(ctx);
  }
}
