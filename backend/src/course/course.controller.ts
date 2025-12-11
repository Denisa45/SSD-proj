import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// --- MULTER CONFIGURATION (File Storage) ---
const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'uploads', 'materials');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  }),
};

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * 🛡️ SAFE USER ID EXTRACTOR
   * This helper function looks for the User ID in this order:
   * 1. Query Param (?userId=5)
   * 2. Body ({ userId: 5 })
   * 3. Request User (if you have Auth/Login set up)
   * 4. Defaults to 1 (So your app doesn't crash if nothing is found)
   */
  private getUserId(queryId?: any, bodyId?: any, req?: any): number {
    if (queryId) return parseInt(queryId);
    if (bodyId) return parseInt(bodyId);
    if (req?.user?.id) return req.user.id; // Tries to get from Auth token
    // console.log('⚠️ No User ID found. Defaulting to 1 for testing.');
    return 1; // Fallback to User 1 so data always shows
  }

  // --- 1. GET ALL COURSES ---
  @Get()
  findAll(@Query('userId') queryUserId: string, @Req() req: any) {
    const userId = this.getUserId(queryUserId, null, req);
    return this.courseService.findAllByUser(userId);
  }

  // --- 2. GET ONE COURSE ---
  @Get(':id')
  getCourse(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') queryUserId: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(queryUserId, null, req);
    return this.courseService.getCourseById(id, userId);
  }

  // --- 3. CREATE COURSE ---
  @Post()
  create(
    @Body('userId') bodyUserId: any,
    @Body() courseData: any,
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.create(courseData, userId);
  }

  // --- 4. DELETE COURSE ---
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') queryUserId: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(queryUserId, null, req);
    return this.courseService.delete(id, userId);
  }

  // --- 5. UPDATE COURSE ---
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @Body() updates: any,
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.updateCourse(id, userId, updates);
  }

  // --- TASK MANAGEMENT ---
  @Post(':id/tasks')
  addTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @Body('taskName') taskName: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.addTask(id, userId, taskName);
  }

  @Patch(':id/tasks/toggle')
  toggleTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @Body('taskName') taskName: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.toggleTask(id, userId, taskName);
  }

  @Delete(':id/tasks')
  removeTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @Body('taskName') taskName: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.removeTask(id, userId, taskName);
  }

  // --- MATERIAL MANAGEMENT (Uploads) ---
  @Post(':id/materials')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async addMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.addMaterial(id, userId, file.filename);
  }

  @Delete(':id/materials/:fileName')
  async removeMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Param('fileName') fileName: string,
    @Query('userId') queryUserId: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(queryUserId, null, req);
    return this.courseService.removeMaterial(id, userId, fileName);
  }

  // ✅ ADD GRADE ENDPOINT
  @Post(':id/grades')
  addGrade(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') bodyUserId: any,
    @Body() gradeData: { name: string; score: number }, // Expects { "name": "Exam 1", "score": 95 }
    @Req() req: any,
  ) {
    const userId = this.getUserId(null, bodyUserId, req);
    return this.courseService.addGrade(id, userId, gradeData);
  }

  // ✅ REMOVE GRADE ENDPOINT
  @Delete(':id/grades/:gradeName')
  removeGrade(
    @Param('id', ParseIntPipe) id: number,
    @Param('gradeName') gradeName: string,
    @Query('userId') queryUserId: string,
    @Req() req: any,
  ) {
    const userId = this.getUserId(queryUserId, null, req);
    return this.courseService.removeGrade(id, userId, gradeName);
  }
}
