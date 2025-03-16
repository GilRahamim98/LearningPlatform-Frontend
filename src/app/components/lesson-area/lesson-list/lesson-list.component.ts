import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { LessonCardComponent } from '../lesson-card/lesson-card.component';
import { LessonModel } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-lesson-list',
    imports: [LessonCardComponent],
    templateUrl: './lesson-list.component.html',
    styleUrl: './lesson-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonListComponent implements OnInit {
    public lessons = signal<LessonModel[]>([]);
    public isEnrolled: boolean; // Flag to check if the user is enrolled

    @Input()
    public courseId: string; // Input property for course ID

    constructor(
        private lessonService: LessonService,
        private userService: UserService
    ) { }

    public async ngOnInit() {
        const roleName = this.userService.getUserRoleName();
        if (roleName === "Student") {
            this.isEnrolled = this.userService.isEnrolled(this.courseId); // Checking if the user is enrolled in the course

            if (this.isEnrolled) {
                // Fetching and setting lessons if the user is enrolled
                this.lessons.set(await this.lessonService.getLessonsByCourse(this.courseId));
            } else {
                // Fetching and setting lesson previews if the user is not enrolled
                this.lessons.set((await this.lessonService.getLessonPreviewByCourse(this.courseId)).map(preview => ({
                    id: preview.id,
                    title: preview.title,
                    courseId: preview.courseId,
                    videoUrl: ""
                })));
            }
        } else if (roleName === "Instructor" || roleName === "Admin") {
            // Fetching and setting lessons if the user is an instructor or admin
            this.lessons.set(await this.lessonService.getLessonsByCourse(this.courseId));
        } else {
            // Fetching and setting lesson previews for other roles
            this.lessons.set((await this.lessonService.getLessonPreviewByCourse(this.courseId)).map(preview => ({
                id: preview.id,
                title: preview.title,
                courseId: preview.courseId,
                videoUrl: ""
            })));
        }
    }


}
