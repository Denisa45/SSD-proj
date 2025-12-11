import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySessionModule } from './study-session/study-session.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { EventModule } from './event/event.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ServeStaticModule } from '@nestjs/serve-static'; // <--- Import this
import { join } from 'path'; // <--- Import this

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'andrei4590',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StudySessionModule,
    AuthModule,
    UserModule,
    CourseModule,
    EventModule,
    ScheduleModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // The folder on your computer
      serveRoot: '/uploads', // The URL prefix (e.g. localhost:3000/uploads/...)
    }),
  ],
})
export class AppModule {}
