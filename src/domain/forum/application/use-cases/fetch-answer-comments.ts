import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchAnswerAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answercommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerAnswerCommentsUseCaseRequest): Promise<FetchAnswerAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answercommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({
      comments,
    });
  }
}
