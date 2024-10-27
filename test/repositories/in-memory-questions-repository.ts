import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

import { InMemoryQuestionAttachementsRepository } from './in-memory-question-attachements-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = [];

  constructor(
    private questionAttachements: InMemoryQuestionAttachementsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

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

  async findDetailsBySlug(slug: string) {
    const question = this.questions.find(
      question => question.slug.value === slug,
    );

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.students.find(student => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with "${question.authorId.toString()} does not exist."`,
      );
    }

    const questionAttachments =
      this.questionAttachements.questionAttachements.filter(
        questionAttachment => {
          return questionAttachment.questionId.equals(question.id);
        },
      );

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentsRepository.attachments.find(
        attachment => {
          return attachment.id.equals(questionAttachment.attachementId);
        },
      );

      if (!attachment) {
        throw new Error(
          `Attachment with "${questionAttachment.attachementId.toString()} does not exist."`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
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
