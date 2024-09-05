import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AttachementProps {
  title: string;
  link: string;
}

export class Attachement extends Entity<AttachementProps> {
  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  static create(props: AttachementProps, id?: UniqueEntityID) {
    const attachement = new Attachement(props, id);

    return attachement;
  }
}
