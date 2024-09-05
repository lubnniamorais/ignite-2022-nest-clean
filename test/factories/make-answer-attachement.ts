import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  AnswerAttachement,
  AnswerAttachementProps,
} from '@/domain/forum/enterprise/entities/answer-attachement';

export function makeAnswerAttachement(
  override: Partial<AnswerAttachementProps> = {},
  id?: UniqueEntityID,
) {
  const answerattachement = AnswerAttachement.create(
    {
      answerId: new UniqueEntityID(),
      attachementId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerattachement;
}
