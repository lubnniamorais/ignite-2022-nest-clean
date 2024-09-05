import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { DeleteAnswerUseCase } from './delete-answer';

import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryAnswerAttachementsRepository } from 'test/repositories/in-memory-answer-attachements-repository';
import { makeAnswerAttachement } from 'test/factories/make-answer-attachement';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer', async () => {
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
      answerId: 'answer-1',
    });

    expect(inMemoryAnswersRepository.answers).toHaveLength(0);
    expect(
      inMemoryAnswerAttachementsRepository.answerAttachements,
    ).toHaveLength(0);
  });

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
