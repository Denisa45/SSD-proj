import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySession } from './study-session.entity';
import { StudySessionService } from './study-session.service';
import { StudySessionController } from './study-session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudySession])],
  controllers: [StudySessionController],
  providers: [StudySessionService],
})
export class StudySessionModule {}
