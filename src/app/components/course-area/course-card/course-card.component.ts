import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CourseModel } from '../../../models/course.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserStore } from '../../../storage/user-store';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { EnrollmentModel } from '../../../models/enrollment.model';
import { EnrollmentStore } from '../../../storage/enrollment-store';

@Component({
    selector: 'app-course-card',
    imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatIconModule, MatButtonModule],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',

})
export class CourseCardComponent implements OnInit {
    public router = inject(Router);
    public userStore = inject(UserStore);
    public userService = inject(UserService);
    public enrollmentStore = inject(EnrollmentStore);
    public isEnrolled: boolean;

    @Input()
    public course: CourseModel;

    public ngOnInit() {
        this.isEnrolled = this.enrollmentStore.enrollments()?.some(e => e.courseId === this.course.id);
    }

    public displayDetails(id: string) {
        this.router.navigateByUrl("/courses/" + id);
    }

    public enrollStudent(): void {
        const enrollment = new EnrollmentModel();
        enrollment.courseId = this.course.id;
        enrollment.userId = this.userStore.user().id;
        enrollment.createdAt = new Date();
        this.userService.enrollStudent(enrollment);
        this.isEnrolled = true;

    }



}
