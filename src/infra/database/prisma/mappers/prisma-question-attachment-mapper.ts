import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachement } from '@/domain/forum/enterprise/entities/question-attachement';
import { Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachement {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.');
    }
    return QuestionAttachement.create(
      {
        attachementId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
