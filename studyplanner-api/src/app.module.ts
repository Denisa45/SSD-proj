import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySessionModule } from './study-session/study-session.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'andrei4590',
      database: 'StudyPlanner',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StudySessionModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
