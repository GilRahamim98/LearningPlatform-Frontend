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

    // Fetch all lessons for a specific course from the server
    public async getLessonsByCourse(courseId: string): Promise<LessonModel[]> {
        // Send a GET request to fetch lessons by course ID
        const lessons$ = this.http.get<LessonModel[]>(environment.lessonsUrl + `course/${courseId}`);
        const lessons = await firstValueFrom(lessons$);
        return lessons;
    }

    // Fetch lesson previews for a specific course from the server
    public async getLessonPreviewByCourse(courseId: string): Promise<PreviewLessonModel[]> {
        // Send a GET request to fetch lesson previews by course ID
        const lessons$ = this.http.get<PreviewLessonModel[]>(environment.lessonsUrl + `course-preview/${courseId}`);
        const lessons = await firstValueFrom(lessons$);
        return lessons;
    }

    // Add multiple lessons to the server
    public async addLessons(lessons: LessonModel[]): Promise<void> {
        // Send a POST request to add multiple lessons
        const lessons$ = this.http.post(environment.lessonsUrl + "add-multiple", lessons);
        await firstValueFrom(lessons$);
    }

    // Delete multiple lessons from the server
    public async deleteLessons(ids: string[]): Promise<void> {
        // Send a DELETE request to remove multiple lessons
        const lessons$ = this.http.delete(environment.lessonsUrl + "delete-multiple", { body: ids });
        await firstValueFrom(lessons$);
    }

    // Update multiple lessons on the server
    public async updateLessons(lessons: LessonModel[]): Promise<void> {
        // Send a PUT request to update multiple lessons
        const lessons$ = this.http.put(environment.lessonsUrl + "update-multiple", lessons);
        await firstValueFrom(lessons$);
    }



}
