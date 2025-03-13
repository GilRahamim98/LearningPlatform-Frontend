import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserStore } from '../../../storage/user-store';
import { EnrollmentCardComponent } from '../enrollment-card/enrollment-card.component';
import { CourseModel } from '../../../models/course.model';

@Component({
  selector: 'app-enrollment-list',
  imports: [CommonModule,EnrollmentCardComponent],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class EnrollmentListComponent implements OnInit {
    public courses = signal<CourseModel[]>([]);

    private userService = inject(UserService);
    private userStore = inject(UserStore);

    public async ngOnInit() {
        try{
            this.courses.set(await this.userService.getStudentCourses(this.userStore.user().id));

        }catch(err:any){
            console.log(err); 
        }   
    }

    public handleUnenrolled(courseId:string){        
        this.courses.set(this.courses().filter(course=>course.id !== courseId));
    }


}


