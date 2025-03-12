import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit,signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LessonModel } from '../../../models/lesson.model';
import { UserStore } from '../../../storage/user-store';
import { UserService } from '../../../services/user.service';
import { CreateProgressModel } from '../../../models/createProgress.model';
import { ProgressModel } from '../../../models/progress.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressStore } from '../../../storage/progress-store';
import { NotificationService } from '../../../services/notification.service';
import { PreviewLessonModel } from '../../../models/previewLesson.model';

@Component({
    selector: 'app-lesson-card',
    imports: [CommonModule,RouterModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './lesson-card.component.html',
    styleUrl: './lesson-card.component.css'
})
export class LessonCardComponent implements OnInit {

    private progressStore = inject(ProgressStore);
    public userStore = inject(UserStore);
    public userService = inject(UserService);
    private activeRoute = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    public isEnrolled :boolean;
    public isWatched = signal(false);

    public progress = signal(new ProgressModel());

    @Input()
    public lesson: LessonModel;

    public async ngOnInit() {
        if (this.userStore.RoleName() === "Student") {
            this.progress.set(this.progressStore.progresses().find(p => p.lessonId === this.lesson.id));
            this.isEnrolled = this.userService.isEnrolled(this.activeRoute.snapshot.params["id"]);
            this.isWatched.set(!!this.progress());
            
        }
    }

    public async watch() {
        try {
            const progress = new CreateProgressModel;
            progress.lessonId = this.lesson.id;
            progress.userId = this.userStore.user().id;
            await this.userService.watchLesson(progress);
            this.isWatched.set(true);
            this.progress.set(this.progressStore.progresses().find(p => p.lessonId === this.lesson.id));
            this.openVideo();
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to watch the lesson");
        }
    }

    public openVideo() {
        window.open(this.lesson?.videoUrl, '_blank');
    }

}
