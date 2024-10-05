import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { z as zod } from 'zod';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const editAnswerBodySchema = zod.object({
  content: zod.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = zod.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachementsIds: [],
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}