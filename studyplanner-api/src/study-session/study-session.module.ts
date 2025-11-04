import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySession } from './study-session.entity';
import { StudySessionService } from './study-session.service';
import { StudySessionController } from './study-session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudySession])],  // ✅ registers repository
  providers: [StudySessionService],
  controllers: [StudySessionController],
  exports: [TypeOrmModule],  // ✅ allows export of repository to AppModule
})
export class StudySessionModule {}
