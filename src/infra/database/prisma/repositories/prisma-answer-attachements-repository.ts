import { AnswerAttachementsRepository } from '@/domain/forum/application/repositories/answer-attachements-repository';
import { AnswerAttachement } from '@/domain/forum/enterprise/entities/answer-attachement';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerAttachementsRepository
  implements AnswerAttachementsRepository
{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]> {
    throw new Error('Method not implemented.');
  }

  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
