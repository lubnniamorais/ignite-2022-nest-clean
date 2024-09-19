import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Student } from '../../enterprise/entities/student';
import { StudentsRepository } from '../repositories/students-repository';

import { Either, right, left } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;
@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
