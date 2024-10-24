import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';

import { makeQuestionComment } from 'test/factories/make-question-comment';

import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.students.push(student);

    const comment01 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });

    const comment02 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });

    const comment03 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment01);
    await inMemoryQuestionCommentsRepository.create(comment02);
    await inMemoryQuestionCommentsRepository.create(comment03);

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment01.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment02.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment03.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.students.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
