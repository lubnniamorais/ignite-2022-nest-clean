import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';

import { Attachment } from '@/domain/forum/enterprise/entities/attachement';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public attachments: Attachment[] = [];

  async create(attachment: Attachment) {
    this.attachments.push(attachment);
  }
}
