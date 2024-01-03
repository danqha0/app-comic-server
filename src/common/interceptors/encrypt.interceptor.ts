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
      map((data) => {
        const { publicKey } = this.cryptedService.generateKeyPair();
        console.log(publicKey);
        const encryptedData = this.cryptedService.encrypt(
          JSON.stringify(data),
          publicKey,
        );
        return encryptedData;
      }),
    );
  }
}
