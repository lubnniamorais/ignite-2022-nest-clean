import { QuestionAttachementsRepository } from '@/domain/forum/application/repositories/question-attachements-repository';

import { QuestionAttachement } from '@/domain/forum/enterprise/entities/question-attachement';

export class InMemoryQuestionAttachementsRepository
  implements QuestionAttachementsRepository
{
  public questionAttachements: QuestionAttachement[] = [];

  async createMany(attachments: QuestionAttachement[]): Promise<void> {
    this.questionAttachements.push(...attachments);
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachement[]> {
    const questionAttachements = this.questionAttachements.filter(
      questionAttachement =>
        questionAttachement.questionId.toString() === questionId,
    );

    return questionAttachements;
  }

  async deleteMany(attachments: QuestionAttachement[]): Promise<void> {
    const questionAttachements = this.questionAttachements.filter(
      questionAttachement => {
        return !attachments.some(attachment =>
          attachment.equals(questionAttachement),
        );
      },
    );

    this.questionAttachements = questionAttachements;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachements = this.questionAttachements.filter(
      questionAttachement =>
        questionAttachement.questionId.toString() !== questionId,
    );

    this.questionAttachements = questionAttachements;
  }
}
