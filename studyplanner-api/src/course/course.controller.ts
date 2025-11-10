import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req,Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Get()
  getAll(@Req() req: any): Promise<Course[]> {
    const user = req.user;
    return this.service.findAllByUser(user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: Partial<Course>) {
    const user = req.user;
    return this.service.create(body, user.id );
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: number) {
    const user = req.user;
    return this.service.delete(id, user.id);
  }

  @Post(':id/tasks')
  addTask(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: { name: string }
  ) {
    return this.service.addTask(id, req.user.id, body.name);
  }

  @Post(':id/tasks/toggle')
  toggleTask(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: { name: string }
  ) {
    return this.service.toggleTask(id, req.user.id, body.name);
  }


  @Get(':id')
  getCourseById(@Req() req:any, @Param('id') id:number)
  {
    const user=req.user;
    return this.service.getCourseById(id,user.id);
  }

  @Post(':id/tasks/remove')
  removeTask(@Param('id') id:number,@Req() req:any, @Body() body:{name:string}){
    return this.service.removeTask(id,req.user.id,body.name);
  }

  @Put(':id')
  updateCourse(@Param('id') id:number, @Req() req:any, @Body() body:Partial<Course>){
    return this.service.updateCourse(id,req.user.id,body);
  }

  @Post(':id/materials')
  @UseInterceptors(
    FileInterceptor('file',{
      storage:diskStorage({
        destination:'.uploads/materials',
        filename:(req,file,callback)=>{
          const uniqueName=`${Date.now()}-${file.originalname}`;
          callback(null,uniqueName);
        }
      })
    })
  )

  async uploadMaterial(
    @Param('id') id:number, 
    @Req() req:any,
    @UploadedFile() file : Express.Multer.File
  ){
    return this.service.addMaterial(id,req.user.id,file.filename);
  }

  @Delete(':id/materials/:fileName')
async removeMaterial(
  @Param('id') id: number,
  @Param('fileName') fileName: string,
  @Req() req: any
) {
  return this.service.removeMaterial(id, req.user.id, fileName);
}


}
