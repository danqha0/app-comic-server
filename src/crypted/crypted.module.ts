import { Module } from '@nestjs/common';
import { CryptedController } from './crypted.controller';
import { CryptedService } from './crypted.service';

@Module({
  controllers: [CryptedController],
  providers: [CryptedService],
})
export class CryptedModule {}
