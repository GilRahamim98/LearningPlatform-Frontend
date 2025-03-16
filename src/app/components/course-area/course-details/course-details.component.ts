import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { LessonListComponent } from "../../lesson-area/lesson-list/lesson-list.component";
import { NotificationService } from '../../../services/notification.service';
import { PreviewLessonModel } from '../../../models/previewLesson.model';

@Component({
    selector: 'app-course-details',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, LessonListComponent],
    templateUrl: './course-details.component.html',
    styleUrl: './course-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetailsComponent implements OnInit {
    public course = signal<CourseModel>(new CourseModel());
    public lessons = signal<PreviewLessonModel[]>([]);

    public constructor(
        private activatedRoute: ActivatedRoute,
        private lessonService: LessonService,
        private notificationService: NotificationService,
    ) { }

    public async ngOnInit() {
        try {
            const id = this.activatedRoute.snapshot.params["id"];
            // Setting course details from resolved data
            this.course.set(this.activatedRoute.snapshot.data["courseDetails"]);
            // Fetching and setting lesson previews for the course
            this.lessons.set(await this.lessonService.getLessonPreviewByCourse(id));
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to get course details");
        }
    }
}
