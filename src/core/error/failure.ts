export abstract class Failure {
  constructor(public readonly message: string) {}
}

export class GraphqlError extends Failure {
  constructor(message: string) {
    super(message);
  }
}

export class RestFailure extends Failure {
  constructor(message: string) {
    super(message);
  }
}

export class ServerFailure extends Failure {
  constructor(message: string) {
    super(message);
  }
}

export class NetworkFailure extends Failure {
  constructor(message: string) {
    super(message);
  }
}

export class CacheFailure extends Failure {
  constructor(message: string) {
    super(message);
  }
}
