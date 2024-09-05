import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Either, right } from '@/core/either';
import { QuestionAttachement } from '../../enterprise/entities/question-attachement';
import { QuestionAttachementList } from '../../enterprise/entities/question-attachement-list';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachementsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachementsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    const questionAttachements = attachementsIds.map(attachementId => {
      return QuestionAttachement.create({
        attachementId: new UniqueEntityID(attachementId),
        questionId: question.id,
      });
    });

    question.attachements = new QuestionAttachementList(questionAttachements);

    await this.questionsRepository.create(question);

    return right({
      question,
    });
  }
}
