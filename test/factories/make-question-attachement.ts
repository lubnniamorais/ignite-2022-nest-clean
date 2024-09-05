import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  QuestionAttachement,
  QuestionAttachementProps,
} from '@/domain/forum/enterprise/entities/question-attachement';

export function makeQuestionAttachement(
  override: Partial<QuestionAttachementProps> = {},
  id?: UniqueEntityID,
) {
  const questionattachement = QuestionAttachement.create(
    {
      questionId: new UniqueEntityID(),
      attachementId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return questionattachement;
}
