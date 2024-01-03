import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as elliptic from 'elliptic';
import * as mongoose from 'mongoose';
import { Crypted, CryptedDocument } from './schema/crypted.schema';
import { CreateCryptedDto } from './dto/crypted.dto';
const EC = elliptic.ec;

@Injectable()
export class CryptedService {
  constructor(
    @InjectModel(Crypted.name)
    private cryptedModel: mongoose.Model<CryptedDocument>,
  ) {}
  private ec = new EC('curve25519');

  generateKeyPair(): elliptic.ec.KeyPair {
    return this.ec.genKeyPair();
  }

  encrypt(data: string, publicKey: string): string {
    const key = this.ec.keyFromPublic(publicKey, 'hex');
    const encrypted = key.sign(data, 'base64'); // Sửa ở đây
    return encrypted;
  }

  decrypt(encryptedData: string, privateKey: string): string {
    const key = this.ec.keyFromPrivate(privateKey, 'hex');
    const decrypted = key.decrypt(encryptedData, 'utf8'); // Sửa ở đây
    return decrypted;
  }

  async saveKey(createUserDto: CreateCryptedDto): Promise<CryptedDocument> {
    const newUser = new this.cryptedModel({
      ...createUserDto,
    });
    return await newUser.save();
  }
}
