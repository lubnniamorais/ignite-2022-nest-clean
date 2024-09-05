import { UseCaseError } from '@/core/errors/use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    // O super é uma forma de chamar o construtor da classe que estamos estendendo
    super('Resource not found');
  }
}
