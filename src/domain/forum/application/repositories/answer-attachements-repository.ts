import { AnswerAttachement } from '../../enterprise/entities/answer-attachement';

export interface AnswerAttachementsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}
