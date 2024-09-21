import { DomainEvents } from '@/core/events/domain-events';

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = [];

  async create(student: Student) {
    this.students.push(student);

    DomainEvents.dispatchEventsForAggregate(student.id);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.students.find(student => student.email === email);

    if (!student) {
      return null;
    }

    return student;
  }
}
