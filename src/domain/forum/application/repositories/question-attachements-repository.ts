import { QuestionAttachement } from '../../enterprise/entities/question-attachement';

export abstract class QuestionAttachementsRepository {
  abstract createMany(attachments: QuestionAttachement[]): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachement[]>;

  abstract deleteMany(attachments: QuestionAttachement[]): Promise<void>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
