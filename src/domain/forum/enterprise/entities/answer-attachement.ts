import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AnswerAttachementProps {
  answerId: UniqueEntityID;
  attachementId: UniqueEntityID;
}

export class AnswerAttachement extends Entity<AnswerAttachementProps> {
  get answerId() {
    return this.props.answerId;
  }

  get attachementId() {
    return this.props.attachementId;
  }

  static create(props: AnswerAttachementProps, id?: UniqueEntityID) {
    const answerAttachement = new AnswerAttachement(props, id);

    return answerAttachement;
  }
}
