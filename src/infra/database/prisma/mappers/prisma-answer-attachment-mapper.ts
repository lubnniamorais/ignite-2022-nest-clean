import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachement } from '@/domain/forum/enterprise/entities/answer-attachement';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachement {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.');
    }
    return AnswerAttachement.create(
      {
        attachementId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachement[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map(attachment => {
      return attachment.attachementId.toString();
    });

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    };
  }
}
