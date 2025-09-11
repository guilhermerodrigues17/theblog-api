import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing-service.interface';
import { BcryptHashingService } from './hashing/bcrypt-hashing.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [HashingService],
})
export class CommonModule {}
