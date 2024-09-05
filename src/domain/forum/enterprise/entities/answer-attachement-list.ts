import { WatchedList } from '@/core/entities/watched-list';
import { AnswerAttachement } from './answer-attachement';

export class AnswerAttachementList extends WatchedList<AnswerAttachement> {
  compareItems(a: AnswerAttachement, b: AnswerAttachement): boolean {
    return a.attachementId.equals(b.attachementId);
  }
}
