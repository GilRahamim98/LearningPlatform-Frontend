import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { UserStore } from '../../../storage/user-store';
import { Progress } from '../../../utils/types';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-enrollment-card',
    imports: [CommonModule, MatCardModule,MatProgressBarModule,MatProgressSpinnerModule],
    templateUrl: './enrollment-card.component.html',
    styleUrl: './enrollment-card.component.css'
})
export class EnrollmentCardComponent implements OnInit {

    private userStore = inject(UserStore);
    private userService = inject(UserService);
    private router = inject(Router);

    public mode: ProgressSpinnerMode = 'determinate';
    public value = 0;
    public progress :Progress;


    @Input()
    public course: CourseModel;

    public async ngOnInit() {        
        this.progress = await this.userService.getStudentProgressInCourse(this.userStore.user().id,this.course.id);
        this.value =(this.progress.total>0)?(this.progress.watched/this.progress.total)*100 :0;

    }

    public async unenroll(){
        try{
            this.userService.unenrollStudent((await this.userService.getEnrollmentByCourse(this.course.id)).id);
        }catch(err:any){
            console.log(err);
            
        }
    }


    public viewCourseDetails(courseId: string): void {
        this.router.navigateByUrl("/courses/" + courseId);
    }

}
