import { AnswerAttachement } from '../../enterprise/entities/answer-attachement';

export abstract class AnswerAttachementsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
