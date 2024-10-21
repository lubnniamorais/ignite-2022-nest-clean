import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { AnswerQuestionUseCase } from './answer-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachementsRepository } from 'test/repositories/in-memory-answer-attachements-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Nova resposta',
      attachementsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.answers[0].attachements.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.answers[0].attachements.currentItems,
    ).toEqual([
      expect.objectContaining({ attachementId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachementId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Conteúdo da resposta',
      attachementsIds: ['1', '2'],
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
    //       attachmentId: new UniqueEntityID('2'),
    //     }),
    //   ]),
    // );
  });
});
