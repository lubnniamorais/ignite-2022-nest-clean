export abstract class HashComparer {
  // COMPARA O HASH
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
