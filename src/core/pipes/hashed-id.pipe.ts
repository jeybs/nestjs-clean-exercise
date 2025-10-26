import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { HashHelper } from '../helper/hash.helper';

@Injectable()
export class HashedIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    try {
      const id = HashHelper.decodeId(value);
      if (id === 0) {
        throw new BadRequestException(`Invalid ID`);
      }

      return id;
    } catch {
      throw new BadRequestException(`Invalid ID`);
    }
  }
}
