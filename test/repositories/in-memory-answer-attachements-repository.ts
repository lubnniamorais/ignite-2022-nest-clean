import { AnswerAttachementsRepository } from '@/domain/forum/application/repositories/answer-attachements-repository';

import { AnswerAttachement } from '@/domain/forum/enterprise/entities/answer-attachement';

export class InMemoryAnswerAttachementsRepository
  implements AnswerAttachementsRepository
{
  public answerAttachements: AnswerAttachement[] = [];

  async createMany(attachments: AnswerAttachement[]): Promise<void> {
    this.answerAttachements.push(...attachments);
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]> {
    const answerAttachements = this.answerAttachements.filter(
      answerAttachement => answerAttachement.answerId.toString() === answerId,
    );

    return answerAttachements;
  }

  async deleteMany(attachments: AnswerAttachement[]): Promise<void> {
    const answerAttachements = this.answerAttachements.filter(
      answerAttachement => {
        return !attachments.some(attachment =>
          attachment.equals(answerAttachement),
        );
      },
    );

    this.answerAttachements = answerAttachements;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachements = this.answerAttachements.filter(
      answerAttachement => answerAttachement.answerId.toString() !== answerId,
    );

    this.answerAttachements = answerAttachements;
  }
}
