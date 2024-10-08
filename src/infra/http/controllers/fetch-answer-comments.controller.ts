import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { z as zod } from 'zod';

import { CommentPresenter } from '../presenters/comment-presenter';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answerComments = result.value.answerComments;

    return { comments: answerComments.map(CommentPresenter.toHTTP) };
  }
}
