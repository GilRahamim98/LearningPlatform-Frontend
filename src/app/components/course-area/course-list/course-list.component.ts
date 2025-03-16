import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { NotificationService } from '../../../services/notification.service';
import { UserStore } from '../../../storage/user-store';
import { CourseCardComponent } from "../course-card/course-card.component";

@Component({
    selector: 'app-course-list',
    imports: [CommonModule, CourseCardComponent, MatIconModule],
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
        private activatedRoute: ActivatedRoute
    ) { }

    public async ngOnInit() {
        try {
            // Setting courses from the resolved data in the route
            this.courses.set(this.activatedRoute.snapshot.data["allCourses"]);
        } catch (err: any) {
            this.notificationService.error(err.message);
        }
    }

    public addCourse() {
        this.router.navigateByUrl('/courses/new');
    }

    public handleDeletedCourse(courseId: string) {
        // Removing the deleted course from the list
        this.courses.set(this.courses().filter(course => course.id !== courseId));
    }


}


