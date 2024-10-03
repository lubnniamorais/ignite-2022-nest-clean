import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { QuestionAttachementsRepository } from '../repositories/question-attachements-repository';
import { QuestionAttachementList } from '../../enterprise/entities/question-attachement-list';
import { QuestionAttachement } from '../../enterprise/entities/question-attachement';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachementsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachementsRepository: QuestionAttachementsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachementsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findByID(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachements =
      await this.questionAttachementsRepository.findManyByQuestionId(
        questionId,
      );

    const questionAttachementList = new QuestionAttachementList(
      currentQuestionAttachements,
    );

    const questionAttachements = attachementsIds.map(attachementId => {
      return QuestionAttachement.create({
        attachementId: new UniqueEntityID(attachementId),
        questionId: question.id,
      });
    });

    questionAttachementList.update(questionAttachements);

    question.title = title;
    question.content = content;
    question.attachements = questionAttachementList;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
