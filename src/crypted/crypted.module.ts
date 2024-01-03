import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptedService } from './crypted.service';
import { Crypted, CryptedSchema } from './schema/crypted.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crypted.name, schema: CryptedSchema }]),
  ],
  providers: [CryptedService],
  exports: [CryptedService],
})
export class CryptedModule {}
