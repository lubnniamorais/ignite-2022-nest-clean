export abstract class Encrypter {
  // PERMITIR QUE ELE RECEBA UM OBJETO E NO FIM ELE DEVOLVE O TOKEN GERADO
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
