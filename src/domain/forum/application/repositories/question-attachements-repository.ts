import { QuestionAttachement } from '../../enterprise/entities/question-attachement';

export interface QuestionAttachementsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachement[]>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
}
