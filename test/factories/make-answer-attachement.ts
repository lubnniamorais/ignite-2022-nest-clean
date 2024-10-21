import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  AnswerAttachement,
  AnswerAttachementProps,
} from '@/domain/forum/enterprise/entities/answer-attachement';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachement(
  override: Partial<AnswerAttachementProps> = {},
  id?: UniqueEntityID,
) {
  const answerattachement = AnswerAttachement.create(
    {
      answerId: new UniqueEntityID(),
      attachementId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerattachement;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachementProps> = {},
  ): Promise<AnswerAttachement> {
    const answerAttachment = makeAnswerAttachement(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachementId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
