import { Injectable } from '@nestjs/common';
import { Data } from './interfaces/Data.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getId(id: string): string {
    return `Hello World ${id}!`;
  }

  getUserData(data: Data): string {
    return `User Data: ${data.login ?? 'N/A'}, ${data.password ?? 'N/A'}`;
  }

  getId2(id: string, data: Data): string {
    return `ID: ${id}, Data: ${JSON.stringify(data)}`;
  }
}
