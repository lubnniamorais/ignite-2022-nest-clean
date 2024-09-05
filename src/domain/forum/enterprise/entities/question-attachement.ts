import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface QuestionAttachementProps {
  questionId: UniqueEntityID;
  attachementId: UniqueEntityID;
}

export class QuestionAttachement extends Entity<QuestionAttachementProps> {
  get questionId() {
    return this.props.questionId;
  }

  get attachementId() {
    return this.props.attachementId;
  }

  static create(props: QuestionAttachementProps, id?: UniqueEntityID) {
    const questionAttachement = new QuestionAttachement(props, id);

    return questionAttachement;
  }
}
