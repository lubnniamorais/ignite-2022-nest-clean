import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachementsRepository } from '@/domain/forum/application/repositories/question-attachements-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = [];

  constructor(private questionAttachements: QuestionAttachementsRepository) {}

  async create(question: Question) {
    this.questions.push(question);

    await this.questionAttachements.createMany(
      question.attachements.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findByID(id: string): Promise<Question | null> {
    const question = this.questions.find(
      question => question.id.toString() === id,
    );

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.questions.find(
      question => question.slug.value === slug,
    );

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.questions.findIndex(
      item => item.id === question.id,
    );

    this.questions[questionIndex] = question;

    await this.questionAttachements.createMany(
      question.attachements.getNewItems(),
    );

    await this.questionAttachements.deleteMany(
      question.attachements.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.questions.findIndex(
      item => item.id === question.id,
    );

    this.questions.splice(questionIndex, 1);

    this.questionAttachements.deleteManyByQuestionId(question.id.toString());
  }
}
