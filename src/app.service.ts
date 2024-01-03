import { Injectable, OnModuleInit } from '@nestjs/common';
import { CryptedService } from './crypted/crypted.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly cryptedService: CryptedService) {}

  async onModuleInit() {
    //const keyPair = this.cryptedService.generateKeyPair();
    //await this..saveKeyPair(keyPair);
    console.log('hi');
  }

  getHello(): string {
    return 'DangHao';
  }
}
