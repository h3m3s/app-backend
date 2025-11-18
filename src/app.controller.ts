import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(('/article/:id'))
  getId(@Param('id') id: string): string {
    return this.appService.getId(id);
  }

  @Post()
  getUserData(@Body() data: any): string {
    return this.appService.getUserData(data);
  }
  @Patch(':id')
  getId2(@Param('id') id: string, @Body() data: object): string {
    return this.appService.getId2(id, data);
  }
  
} 
