import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachementsRepository } from '@/domain/forum/application/repositories/question-attachements-repository';
import { QuestionAttachement } from '@/domain/forum/enterprise/entities/question-attachement';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachementsRepository
  implements QuestionAttachementsRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachement[]> {
    throw new Error('Method not implemented.');
  }

  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
