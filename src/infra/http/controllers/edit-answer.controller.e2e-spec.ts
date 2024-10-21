import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionFactory } from 'test/factories/make-question';
import { AnswerFactory } from 'test/factories/make-answer';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachement';

describe('Edit answer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /answers/:id', async () => {
    // Criando um novo usuário
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const attachment01 = await attachmentFactory.makePrismaAttachment();
    const attachment02 = await attachmentFactory.makePrismaAttachment();

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachementId: attachment01.id,
      answerId: answer.id,
    });

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachementId: attachment02.id,
      answerId: answer.id,
    });

    const attachment03 = await attachmentFactory.makePrismaAttachment();

    const answerId = answer.id.toString();

    // O SET é utilizado para colocar um Header
    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer content',
        attachments: [attachment01.id.toString(), attachment03.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'New answer content',
      },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment01.id.toString(),
        }),
        expect.objectContaining({
          id: attachment03.id.toString(),
        }),
      ]),
    );
  });
});
