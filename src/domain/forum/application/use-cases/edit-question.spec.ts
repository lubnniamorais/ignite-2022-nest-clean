import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { EditQuestionUseCase } from './edit-question';

import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryQuestionAttachementsRepository } from 'test/repositories/in-memory-question-attachements-repository';
import { makeQuestionAttachement } from 'test/factories/make-question-attachement';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachementsRepository: InMemoryQuestionAttachementsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachementsRepository =
      new InMemoryQuestionAttachementsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachementsRepository,
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachementsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachementsRepository.questionAttachements.push(
      makeQuestionAttachement({
        questionId: newQuestion.id,
        attachementId: new UniqueEntityID('1'),
      }),

      makeQuestionAttachement({
        questionId: newQuestion.id,
        attachementId: new UniqueEntityID('2'),
      }),
    );

    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toValue(),
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachementsIds: ['1', '3'],
    });

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    });
    expect(
      inMemoryQuestionsRepository.questions[0].attachements.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.questions[0].attachements.currentItems,
    ).toEqual([
      expect.objectContaining({ attachementId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachementId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toValue(),
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachementsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachementsRepository.questionAttachements.push(
      makeQuestionAttachement({
        questionId: newQuestion.id,
        attachementId: new UniqueEntityID('1'),
      }),

      makeQuestionAttachement({
        questionId: newQuestion.id,
        attachementId: new UniqueEntityID('2'),
      }),
    );

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toValue(),
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachementsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryQuestionAttachementsRepository.questionAttachements,
    ).toHaveLength(2);
    // expect(inMemoryQuestionAttachementsRepository.questionAttachements).toEqual(
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
