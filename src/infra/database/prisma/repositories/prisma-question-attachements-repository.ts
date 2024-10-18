import { QuestionAttachementsRepository } from '@/domain/forum/application/repositories/question-attachements-repository';
import { QuestionAttachement } from '@/domain/forum/enterprise/entities/question-attachement';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';

@Injectable()
export class PrismaQuestionAttachementsRepository
  implements QuestionAttachementsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachement[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachement[]> {
    const questionAttachment = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionAttachment.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteMany(attachments: QuestionAttachement[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map(attachment => {
      return attachment.id.toString();
    });

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
