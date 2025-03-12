import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LessonModel } from '../models/lesson.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { PreviewLessonModel } from '../models/previewLesson.model';

@Injectable({
    providedIn: 'root'
})
export class LessonService {

    private http = inject(HttpClient);


    public async getLessonsByCourse(courseId: string): Promise<LessonModel[]> {
        const lessons$ = this.http.get<LessonModel[]>(environment.lessonsUrl + `course/${courseId}`);
        const lessons = await firstValueFrom(lessons$);
        return lessons;
    }

    public async getLessonPreviewByCourse(courseId: string): Promise<PreviewLessonModel[]> {
        const lessons$ = this.http.get<PreviewLessonModel[]>(environment.lessonsUrl + `course-preview/${courseId}`);
        const lessons = await firstValueFrom(lessons$);
        return lessons;
    }

    public async getLessonById(lessonId: string): Promise<LessonModel> {
        const lesson$ = this.http.get<LessonModel>(environment.lessonsUrl + lessonId);
        const lesson = await firstValueFrom(lesson$);
        return lesson;
    }

    public async addLessons(lessons: LessonModel[]): Promise<void> {
        const lessons$ = this.http.post(environment.lessonsUrl+"add-multiple", lessons);
        await firstValueFrom(lessons$);
    }

    public async deleteLessons(ids:string[]):Promise<void>{
        const lessons$ = this.http.delete(environment.lessonsUrl+"delete-multiple",{body:ids});
        await firstValueFrom(lessons$);
    }

    public async updateLesson(lesson: LessonModel): Promise<LessonModel> {
        const lesson$ = this.http.put<LessonModel>(environment.lessonsUrl + lesson.id, lesson);
        const dbLesson = await firstValueFrom(lesson$);
        return dbLesson;
    }

    

}
