import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { RateMovieDto } from './dto/rate-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestContext } from 'src/users/context-initiator/Request-Context';
import { AuthGuard } from 'src/users/guards/auth.guard';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Patch('rate-movie')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async rateMovie(
    @RequestContext() ctx: any,
    @Body() rateMovieDto: RateMovieDto,
  ) {
    return this.movieService.rateMovie(ctx, rateMovieDto);
  }

  @Get('get-movies')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getAllMovies(@RequestContext() ctx: any) {
    return this.movieService.getAllMovies(ctx);
  }
}
