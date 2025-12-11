import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudySession } from './study-session.entity';

@Injectable()
export class StudySessionService {
    constructor(
        @InjectRepository(StudySession) //access to the database table that corresponds to the StudySession entity
        private readonly repo:Repository<StudySession>,
    ){}

    async findAll():Promise<StudySession[]>{
        return await this.repo.find();
    }

    async create(session:Partial<StudySession>):Promise<StudySession>{
        const newSession=this.repo.create(session);
        return await this.repo.save(newSession);
    }

    async delete(id:number):Promise<{success:boolean}>{
        await this.repo.delete(id);
        return {success:true};
    }


}
