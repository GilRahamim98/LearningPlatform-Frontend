import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from "../course-card/course-card.component";
import { UserStore } from '../../../storage/user-store';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-course-list',
    imports: [CommonModule, CourseCardComponent,MatIconModule],
    templateUrl: './course-list.component.html',
    styleUrl: './course-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseListComponent implements OnInit {

    public userStore = inject(UserStore);
    public courses = signal<CourseModel[]>([]);

    public constructor(
        private router: Router,
        private notificationService: NotificationService,
        private activatedRoute:ActivatedRoute
    ) { }
    public async ngOnInit() {
        try {
            this.courses.set(this.activatedRoute.snapshot.data["allCourses"]);
        } catch (err: any) {
            this.notificationService.error(err.message);
        }
    }

    public addCourse(){
        this.router.navigateByUrl('/courses/new');
    }

    public handleDeletedCourse(courseId: string) {
        this.courses.set(this.courses().filter(course => course.id !== courseId));
    }


}


