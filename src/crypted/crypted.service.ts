import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Crypted, CryptedDocument } from './schema/crypted.schema';
import { CreateCryptedDto } from './dto/crypted.dto';
import * as crypto from 'crypto';

@Injectable()
export class CryptedService {
  constructor(
    @InjectModel(Crypted.name)
    private cryptedModel: mongoose.Model<CryptedDocument>,
  ) {}

  private _id: mongoose.Types.ObjectId;

  async generateKeyPair(): Promise<boolean> {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });
      const key = {
        publicToken: publicKey.toString(),
        privateToken: privateKey.toString(),
      };
      const createKey = await this.create(key);
      this._id = createKey._id;
      return true;
    } catch {
      return false;
    }
  }

  async create(createUserDto: CreateCryptedDto): Promise<CryptedDocument> {
    try {
      const newUser = new this.cryptedModel({
        ...createUserDto,
      });
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }
  public encrypt(publicKey: string, data: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encryptedData = crypto.publicEncrypt(publicKey, buffer);
    return encryptedData.toString('base64');
  }

  public decrypt(privateKey: string, encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(privateKey, buffer);
    return decryptedData.toString('utf8');
  }

  async getPublicKey(): Promise<string> {
    const publicKey = await this.cryptedModel.findById(this._id);
    return publicKey.publicToken;
  }

  async getPrivate(): Promise<string> {
    const privateKey = await this.cryptedModel.findById(this._id);
    return privateKey.privateToken;
  }
}
