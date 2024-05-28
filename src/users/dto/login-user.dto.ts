import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginUserDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
