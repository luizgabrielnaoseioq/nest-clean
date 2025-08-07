export abstract class HashGenerator {
  // Gera uma hash
  abstract hash(plain: string): Promise<string>;
}
