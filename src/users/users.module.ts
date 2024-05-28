import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Category, CategorySchema } from 'src/seed/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User?.name, schema: UserSchema },
      { name: Category?.name, schema: CategorySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
