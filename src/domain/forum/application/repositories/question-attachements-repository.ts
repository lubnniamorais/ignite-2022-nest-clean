import { QuestionAttachement } from '../../enterprise/entities/question-attachement';

export abstract class QuestionAttachementsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachement[]>;

  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
