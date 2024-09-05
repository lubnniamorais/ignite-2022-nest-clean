import { QuestionAttachementsRepository } from '@/domain/forum/application/repositories/question-attachements-repository';

import { QuestionAttachement } from '@/domain/forum/enterprise/entities/question-attachement';

export class InMemoryQuestionAttachementsRepository
  implements QuestionAttachementsRepository
{
  public questionAttachements: QuestionAttachement[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachement[]> {
    const questionAttachements = this.questionAttachements.filter(
      questionAttachement =>
        questionAttachement.questionId.toString() === questionId,
    );

    return questionAttachements;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachements = this.questionAttachements.filter(
      questionAttachement =>
        questionAttachement.questionId.toString() !== questionId,
    );

    this.questionAttachements = questionAttachements;
  }
}
