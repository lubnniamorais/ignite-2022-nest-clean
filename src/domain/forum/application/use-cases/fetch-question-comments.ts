import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Injectable } from '@nestjs/common';

interface FetchQuestionQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questioncommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionQuestionCommentsUseCaseRequest): Promise<FetchQuestionQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questioncommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
