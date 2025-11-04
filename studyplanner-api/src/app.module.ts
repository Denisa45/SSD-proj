import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { StudySessionModule } from './study-session/study-session.module';

const ormOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'andrei4590',
  database: 'studyplanner',
  autoLoadEntities: true,
  synchronize: true,
  ssl: false, // local dev, so no SSL
};

@Module({
  imports: [
    TypeOrmModule.forRoot(ormOptions),
    StudySessionModule,
  ],
})
export class AppModule {}
