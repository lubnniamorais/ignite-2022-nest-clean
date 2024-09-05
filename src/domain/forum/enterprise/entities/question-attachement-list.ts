import { WatchedList } from '@/core/entities/watched-list';
import { QuestionAttachement } from './question-attachement';

export class QuestionAttachementList extends WatchedList<QuestionAttachement> {
  compareItems(a: QuestionAttachement, b: QuestionAttachement): boolean {
    return a.attachementId.equals(b.attachementId);
  }
}
