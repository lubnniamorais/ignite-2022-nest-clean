import { PaginationParams } from '@/core/repositories/pagination-params';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  findByID(id: string): Promise<Answer | null>;
  findManyByQuestionID(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  save(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}
