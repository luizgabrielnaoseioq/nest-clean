export abstract class HashComparer {
  // Compara uma hash com outra hash
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
