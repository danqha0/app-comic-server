import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptedService } from 'src/crypted/crypted.service';

@Injectable()
export class EncryptResponseInterceptor implements NestInterceptor {
  constructor(private readonly cryptedService: CryptedService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const publicKey = await this.cryptedService.getPublicKey();

        const encryptedData = this.cryptedService.encrypt(
          publicKey,
          JSON.stringify(data),
        );

        return JSON.parse(encryptedData);
      }),
    );
  }
}
