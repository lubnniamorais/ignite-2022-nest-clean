import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(file: string) {
    super(`File type "${file}" is not valid.`);
  }
}
