import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health-Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('ping')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
