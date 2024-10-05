import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AnswerAttachementList } from '../../enterprise/entities/answer-attachement-list';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachementsRepository } from '../repositories/answer-attachements-repository';
import { AnswerAttachement } from '../../enterprise/entities/answer-attachement';
import { Injectable } from '@nestjs/common';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachementsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachementsRepository: AnswerAttachementsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachementsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findByID(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachements =
      await this.answerAttachementsRepository.findManyByAnswerId(answerId);

    const answerAttachementList = new AnswerAttachementList(
      currentAnswerAttachements,
    );

    const answerAttachements = attachementsIds.map(attachementId => {
      return AnswerAttachement.create({
        attachementId: new UniqueEntityID(attachementId),
        answerId: answer.id,
      });
    });

    answerAttachementList.update(answerAttachements);

    answer.content = content;
    answer.attachements = answerAttachementList;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
