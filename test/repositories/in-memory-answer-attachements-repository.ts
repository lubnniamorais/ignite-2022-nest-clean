import { AnswerAttachementsRepository } from '@/domain/forum/application/repositories/answer-attachements-repository';

import { AnswerAttachement } from '@/domain/forum/enterprise/entities/answer-attachement';

export class InMemoryAnswerAttachementsRepository
  implements AnswerAttachementsRepository
{
  public answerAttachements: AnswerAttachement[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]> {
    const answerAttachements = this.answerAttachements.filter(
      answerAttachement => answerAttachement.answerId.toString() === answerId,
    );

    return answerAttachements;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachements = this.answerAttachements.filter(
      answerAttachement => answerAttachement.answerId.toString() !== answerId,
    );

    this.answerAttachements = answerAttachements;
  }
}
