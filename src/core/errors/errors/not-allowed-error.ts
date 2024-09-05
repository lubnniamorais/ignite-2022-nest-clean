import { UseCaseError } from '@/core/errors/use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    // O super é uma forma de chamar o construtor da classe que estamos estendendo
    super('Not allowed.');
  }
}
