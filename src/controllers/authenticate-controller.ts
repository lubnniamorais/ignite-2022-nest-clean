import { Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';

// const createAccountBodySchema = zod.object({
//   name: zod.string(),
//   email: zod.string().email(),
//   password: zod.string(),
// });

// type CreateAccountBodySchema = zod.infer<typeof createAccountBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  // @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle() {
    const token = this.jwt.sign({ sub: 'user-id' });

    return token;
  }
}
