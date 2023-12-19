import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setOTP(username: string, OTP: string) {
    await this.cacheManager.set(username, OTP, 30000);
  }

  async getOTP(username: string) {
    try {
      const OTP = await this.cacheManager.get(username);
      return OTP;
    } catch {
      console.log('otp null');
      return null;
    }
  }
}
