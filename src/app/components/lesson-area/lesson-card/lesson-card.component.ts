import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LessonModel } from '../../../models/lesson.model';
import { UserStore } from '../../../storage/user-store';
import { UserService } from '../../../services/user.service';
import { Progress } from '../../../utils/types';
import { CreateProgressModel } from '../../../models/createProgress.model';

@Component({
    selector: 'app-lesson-card',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './lesson-card.component.html',
    styleUrl: './lesson-card.component.css'
})
export class LessonCardComponent implements OnInit {
    public userStore = inject(UserStore);
    public userService = inject(UserService);
    public isWatched: boolean;

    @Input()
    public lesson: LessonModel;


    public async ngOnInit() {
        if(this.userStore.user()){
            this.isWatched = (await this.userService.getStudentProgress(this.userStore.user()?.id)).some(p => p.lessonId === this.lesson.id);
        }
    }

    public async openVideo() {
        try {
            const progress = new CreateProgressModel;
            progress.lessonId = this.lesson.id;
            progress.userId = this.userStore.user().id;
            await this.userService.watchLesson(progress);
            window.open(this.lesson.videoUrl, '_blank');

        } catch (err: any) {
            console.log(err);

        }
    }

}
