import { Injectable, OnModuleInit } from '@nestjs/common';
import { CryptedService } from './crypted/crypted.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly cryptedService: CryptedService) {}

  async onModuleInit() {
    const keyPair = this.cryptedService.generateKeyPair();
    if (keyPair) {
      console.log('tạo key thành công');
    } else {
      console.log('tạo key tb');
    }
  }

  getHello(): string {
    return 'DangHao';
  }
}
