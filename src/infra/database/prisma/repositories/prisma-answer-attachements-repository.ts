import { AnswerAttachementsRepository } from '@/domain/forum/application/repositories/answer-attachements-repository';
import { AnswerAttachement } from '@/domain/forum/enterprise/entities/answer-attachement';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';

@Injectable()
export class PrismaAnswerAttachementsRepository
  implements AnswerAttachementsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachement[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachement[]> {
    const answerAttachment = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteMany(attachments: AnswerAttachement[]): Promise<void> {
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

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}
