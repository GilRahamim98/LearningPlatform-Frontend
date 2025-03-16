import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CreateProgressModel } from '../../../models/createProgress.model';
import { LessonModel } from '../../../models/lesson.model';
import { ProgressModel } from '../../../models/progress.model';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { ProgressStore } from '../../../storage/progress-store';
import { UserStore } from '../../../storage/user-store';

@Component({
    selector: 'app-lesson-card',
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './lesson-card.component.html',
    styleUrl: './lesson-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonCardComponent implements OnInit {

    private progressStore = inject(ProgressStore);
    public userStore = inject(UserStore);
    public userService = inject(UserService);
    private activeRoute = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    public isEnrolled: boolean; // Flag to check if the user is enrolled
    public isWatched = signal(false); // Signal to check if the lesson is watched

    public progress = signal(new ProgressModel()); // Signal to hold the progress

    @Input()
    public lesson: LessonModel; // Input property for lesson

    public async ngOnInit() {
        if (this.userStore.RoleName() === "Student") {
            // Setting progress for the lesson
            this.progress.set(this.progressStore.progresses().find(p => p.lessonId === this.lesson.id));
            this.isEnrolled = this.userService.isEnrolled(this.activeRoute.snapshot.params["id"]);
            this.isWatched.set(!!this.progress());
        }
    }

    public async watch() {
        try {
            // Creating a new progress record for the lesson
            const progress = new CreateProgressModel;
            progress.lessonId = this.lesson.id;
            progress.userId = this.userStore.user().id;
            await this.userService.watchLesson(progress);
            // Setting watched status and updating progress
            this.isWatched.set(true);
            this.progress.set(this.progressStore.progresses().find(p => p.lessonId === this.lesson.id));
            this.openVideo();
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to watch the lesson");
        }
    }

    // OPening the lesson video in a new tab
    public openVideo() {
        window.open(this.lesson?.videoUrl, '_blank');
    }

}
