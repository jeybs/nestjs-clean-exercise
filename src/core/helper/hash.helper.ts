import Hashids from 'hashids';

export class HashHelper {
  static encodeId(id: number) {
    const hashIds = new Hashids(
      process.env.HASH_SALT,
      10,
      'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789',
    );
    return hashIds.encode(id);
  }

  static decodeId(encodedId: string) {
    const hashIds = new Hashids(
      process.env.HASH_SALT,
      10,
      'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789',
    );
    const decodedId = hashIds.decode(encodedId);

    if (decodedId.length > 0) {
      return Number(decodedId);
    }

    return 0;
  }
}
