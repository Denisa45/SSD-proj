import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 💡 MANDATORY CORS FIX: This allows your Angular app to talk to the backend
  app.enableCors({
    origin: 'http://localhost:4200', // Allow only the Angular port
    credentials: true,
  });
  await app.listen(3000); // Assuming your backend runs on 3000
}
bootstrap();