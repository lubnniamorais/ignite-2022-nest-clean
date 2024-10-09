import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Injectable } from '@nestjs/common';

interface FetchAnswerAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answercommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerAnswerCommentsUseCaseRequest): Promise<FetchAnswerAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answercommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}
