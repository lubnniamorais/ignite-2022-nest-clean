import { Attachement } from '../../enterprise/entities/attachement';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachement): Promise<void>;
}
