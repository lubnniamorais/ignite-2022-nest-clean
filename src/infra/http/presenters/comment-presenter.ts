import { Comment } from '@/domain/forum/enterprise/entities/comment';

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
    };
  }
}
