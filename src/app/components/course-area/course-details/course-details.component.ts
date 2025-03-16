import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { LessonModel } from '../../../models/lesson.model';
import { LessonCardComponent } from '../../lesson-area/lesson-card/lesson-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
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
        private courseService: CourseService,
        private lessonService: LessonService,
        private notificationService: NotificationService,
    ) { }

    public async ngOnInit() {
        try {
            const id = this.activatedRoute.snapshot.params["id"];
            this.course.set(this.activatedRoute.snapshot.data["courseDetails"]);
            this.lessons.set(await this.lessonService.getLessonPreviewByCourse(id));
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to get course details");
        }
    }
}
