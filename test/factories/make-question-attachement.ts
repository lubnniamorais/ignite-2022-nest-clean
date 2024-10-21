import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  QuestionAttachement,
  QuestionAttachementProps,
} from '@/domain/forum/enterprise/entities/question-attachement';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeQuestionAttachement(
  override: Partial<QuestionAttachementProps> = {},
  id?: UniqueEntityID,
) {
  const questionattachement = QuestionAttachement.create(
    {
      questionId: new UniqueEntityID(),
      attachementId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return questionattachement;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachementProps> = {},
  ): Promise<QuestionAttachement> {
    const questionAttachment = makeQuestionAttachement(data);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachementId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });

    return questionAttachment;
  }
}
