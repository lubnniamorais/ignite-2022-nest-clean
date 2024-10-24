import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questioncommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionQuestionCommentsUseCaseRequest): Promise<FetchQuestionQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questioncommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({
      comments,
    });
  }
}
