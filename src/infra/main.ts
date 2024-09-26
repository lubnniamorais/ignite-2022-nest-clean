import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './env/env';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const envService = app.get(EnvService);

  // NOME DA VARIÁVEL AMBIENTE
  const port = envService.get('PORT');

  await app.listen(port);
}
bootstrap();
