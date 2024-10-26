import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

import { makeAnswerComment } from 'test/factories/make-answer-comment';

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.students.push(student);

    const comment01 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    const comment02 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    const comment03 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(comment01);
    await inMemoryAnswerCommentsRepository.create(comment02);
    await inMemoryAnswerCommentsRepository.create(comment03);

    const result = await sut.execute({
      answerId: 'answer-1',
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

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.students.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
