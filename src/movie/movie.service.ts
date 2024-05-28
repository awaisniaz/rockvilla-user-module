import { Injectable } from '@nestjs/common';
import { RateMovieDto } from './dto/rate-movie.dto';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/seed/schemas/category.schema';
import axios from 'axios';
import { BaseResponse } from 'src/shared/base-output.dto';
@Injectable()
export class MovieService {
  constructor(@InjectModel(User?.name) private userModel: Model<User>) {}
  async getAllMovies(ctx: any): Promise<any[]> {
    const user = await this.userModel
      .findOne({ email: ctx?.user?.email })
      .populate({ path: 'categories', select: 'name' })
      .exec();
    const categoryList = user?.categories?.map((item: Category) => {
      return item?.name;
    });
    const movies = await axios.get(
      `${process.env.MOVIE_SERVICE_API_URL}get-movies?moviesname=${categoryList?.join(',')}`,
    );
    const finalData = movies?.data?.map((item) => {
      const alreadyRated = item?.ratings?.find(
        (i: any) => i?.user == ctx?.user?.sub,
      );
      if (alreadyRated) {
        item = { ...item, yourRating: alreadyRated?.rating, isRated: true };
        return item;
      }
      item = { ...item, yourRating: 0, isRated: false };
      return item;
    });
    return finalData ?? [];
  }

  async rateMovie(ctx: any, _input: RateMovieDto): Promise<BaseResponse> {
    const { sub } = ctx?.user;
    await axios.patch(`${process.env.MOVIE_SERVICE_API_URL}rate-movie`, {
      ..._input,
      userId: sub,
    });

    return { message: 'Rate successfully', id: '' };
  }
}
