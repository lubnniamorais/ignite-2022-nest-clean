import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { EditAnswerUseCase } from './edit-answer';

import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryAnswerAttachementsRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { makeAnswerAttachement } from 'test/factories/make-answer-attachement';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachementsRepository,
    );
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachementsRepository.answerAttachements.push(
      makeAnswerAttachement({
        answerId: newAnswer.id,
        attachementId: new UniqueEntityID('1'),
      }),

      makeAnswerAttachement({
        answerId: newAnswer.id,
        attachementId: new UniqueEntityID('2'),
      }),
    );

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toValue(),
      content: 'Conteúdo teste',
      attachementsIds: ['1', '3'],
    });

    expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
      content: 'Conteúdo teste',
    });
    expect(
      inMemoryAnswersRepository.answers[0].attachements.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.answers[0].attachements.currentItems,
    ).toEqual([
      expect.objectContaining({ attachementId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachementId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toValue(),
      content: 'Conteúdo teste',
      attachementsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachments when editing an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachementsRepository.answerAttachements.push(
      makeAnswerAttachement({
        answerId: newAnswer.id,
        attachementId: new UniqueEntityID('1'),
      }),

      makeAnswerAttachement({
        answerId: newAnswer.id,
        attachementId: new UniqueEntityID('2'),
      }),
    );

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toValue(),
      content: 'Conteúdo teste',
      attachementsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryAnswerAttachementsRepository.answerAttachements,
    ).toHaveLength(2);
    // expect(inMemoryAnswerAttachementsRepository.answerAttachements).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining({
    //       attachmentId: new UniqueEntityID('1'),
    //     }),
    //     expect.objectContaining({
    //       attachmentId: new UniqueEntityID('3'),
    //     }),
    //   ]),
    // );
  });
});
