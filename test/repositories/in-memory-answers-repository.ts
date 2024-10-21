import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachementsRepository } from '@/domain/forum/application/repositories/answer-attachements-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = [];

  constructor(private answerAttachements: AnswerAttachementsRepository) {}

  async create(answer: Answer) {
    this.answers.push(answer);

    await this.answerAttachements.createMany(answer.attachements.getItems());

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findByID(id: string): Promise<Answer | null> {
    const answer = this.answers.find(answer => answer.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionID(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.answers
      .filter(answer => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(item => item.id === answer.id);

    this.answers[answerIndex] = answer;

    await this.answerAttachements.createMany(answer.attachements.getNewItems());

    await this.answerAttachements.deleteMany(
      answer.attachements.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(item => item.id === answer.id);

    this.answers.splice(answerIndex, 1);

    this.answerAttachements.deleteManyByAnswerId(answer.id.toString());
  }
}
