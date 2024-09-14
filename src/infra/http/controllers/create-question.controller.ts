import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { z as zod } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = zod.object({
  title: zod.string(),
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = zod.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachementsIds: [],
    });

    // const slug = this.convertToSlug(title);

    // await this.prisma.question.create({
    //   data: {
    //     authorId: userId,
    //     title,
    //     content,
    //     slug,
    //   },
    // });
  }

  // private convertToSlug(title: string): string {
  //   return title
  //     .toLowerCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u836f]/g, '')
  //     .replace(/[^\w\s-]/g, '')
  //     .replace(/\s+/g, '-');
  // }
}
