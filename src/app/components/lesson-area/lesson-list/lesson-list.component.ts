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
    public isEnrolled:boolean;

    @Input()
    public courseId:string;

    constructor(
        private lessonService: LessonService,
        private userService: UserService
    ) { }

    public async ngOnInit() {
        const roleName = this.userService.getUserRoleName();
        if(roleName === "Student"){
            this.isEnrolled = this.userService.isEnrolled(this.courseId);
            
            if(this.isEnrolled){
                this.lessons.set(await this.lessonService.getLessonsByCourse(this.courseId));
            }else{                
                this.lessons.set((await this.lessonService.getLessonPreviewByCourse(this.courseId)).map(preview=>({
                    id:preview.id,
                    title:preview.title,
                    courseId:preview.courseId,
                    videoUrl:""
                })));
            }
        }else if(roleName === "Instructor" || roleName === "Admin"){
            this.lessons.set(await this.lessonService.getLessonsByCourse(this.courseId));
        }else{            
            this.lessons.set((await this.lessonService.getLessonPreviewByCourse(this.courseId)).map(preview=>({
                id:preview.id,
                title:preview.title,
                courseId:preview.courseId,
                videoUrl:""
            })));
        }
    }


}
