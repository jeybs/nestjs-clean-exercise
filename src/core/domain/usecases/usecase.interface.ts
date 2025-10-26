import { Either } from 'fp-ts/lib/Either';
import { Failure } from 'src/core/error/failure';

export interface IUseCase<Input = void, Output = void> {
  execute(input: Input): Promise<Either<Failure, Output>>;
}
