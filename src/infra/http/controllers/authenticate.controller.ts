import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { z as zod } from 'zod';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';

const authenticateBodySchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

type AuthenticateBodySchema = zod.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
