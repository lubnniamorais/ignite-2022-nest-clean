import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionAttachementsRepository } from './prisma/repositories/prisma-question-attachements-repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerAttachementsRepository } from './prisma/repositories/prisma-answer-attachements-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachementsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachementsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachementsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachementsRepository,
  ],
})
export class DatabaseModule {}
