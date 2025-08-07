export abstract class HashCompare {
  // Compara uma hash com outra hash
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
