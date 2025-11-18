import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getId(id: string): string {
    return `Hello World ${id}!`;
  }
  getUserData(data: any) {
    return `User Data: ${data.login}, ${data.password}`;
  }
  getId2(id: string, data: object){
    return `ID: ${id}, Data: ${JSON.stringify(data)}`;
  }
}
