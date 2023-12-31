import { Injectable } from '@nestjs/common';
import * as elliptic from 'elliptic';

const EC = elliptic.ec;
@Injectable()
export class CryptedService {
  private ec = new EC('curve25519');

  generateKeyPair(): elliptic.ec.KeyPair {
    return this.ec.genKeyPair();
  }

  encrypt(data: string, publicKey: string): string {
    const key = this.ec.keyFromPublic(publicKey, 'hex');
    const encrypted = key.encrypt(data, 'base64');
    return encrypted;
  }

  decrypt(encryptedData: string, privateKey: string): string {
    const key = this.ec.keyFromPrivate(privateKey, 'hex');
    const decrypted = key.decrypt(encryptedData, 'utf8');
    return decrypted;
  }
}
