import { AnswerAttachement } from '../../enterprise/entities/answer-attachement';

export abstract class AnswerAttachementsRepository {
  abstract createMany(attachments: AnswerAttachement[]): Promise<void>;
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]>;

  abstract deleteMany(attachments: AnswerAttachement[]): Promise<void>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
