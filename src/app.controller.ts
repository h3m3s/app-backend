import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { AppService } from './app.service';
import type { Data } from './interfaces/Data.interface';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get((':id'))
  getId(@Param('id') id: string): string {
    return this.appService.getId(id);
  }

  @Post()
  getUserData(@Body() data: Data): string {
    return this.appService.getUserData(data);
  }

  @Patch(':id')
  getuserDataWithId(@Param('id') id: string, @Body() data: Data): string {
    return this.appService.getId2(id, data);
  }
  
} 
