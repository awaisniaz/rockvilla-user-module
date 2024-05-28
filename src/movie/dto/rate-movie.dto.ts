import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RateMovieDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  rating: number;
}
