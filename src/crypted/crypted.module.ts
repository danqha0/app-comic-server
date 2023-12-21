import { Module } from '@nestjs/common';
import { CryptedService } from './crypted.service';

@Module({
  providers: [CryptedService],
  exports: [CryptedService],
})
export class CryptedModule {}
