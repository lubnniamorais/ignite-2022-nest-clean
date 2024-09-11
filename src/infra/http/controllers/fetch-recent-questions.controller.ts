import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z as zod } from 'zod';

const pageQueryParamSchema = zod
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(zod.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = zod.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20;

    console.log(perPage);

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}