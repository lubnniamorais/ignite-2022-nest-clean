import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '../../enterprise/entities/answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { AnswerAttachement } from '../../enterprise/entities/answer-attachement';
import { AnswerAttachementList } from '../../enterprise/entities/answer-attachement-list';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  attachementsIds: string[];
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachementsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachements = attachementsIds.map(attachementId => {
      return AnswerAttachement.create({
        attachementId: new UniqueEntityID(attachementId),
        answerId: answer.id,
      });
    });

    answer.attachements = new AnswerAttachementList(answerAttachements);

    await this.answerRepository.create(answer);

    return right({
      answer,
    });
  }
}
