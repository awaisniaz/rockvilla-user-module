import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordInputDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password should be greater than 8 character in length',
  })
  password: string;
}
