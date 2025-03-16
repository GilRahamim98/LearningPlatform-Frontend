import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EnrollmentCardComponent } from '../enrollment-card/enrollment-card.component';
import { CourseModel } from '../../../models/course.model';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-enrollment-list',
    imports: [CommonModule, EnrollmentCardComponent],
    templateUrl: './enrollment-list.component.html',
    styleUrl: './enrollment-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentListComponent implements OnInit {
    private notificationService = inject(NotificationService);
    private activatedRotue = inject(ActivatedRoute);

    public courses = signal<CourseModel[]>([]);

    public async ngOnInit() {
        try {
            const storedEnrollments = this.activatedRotue.snapshot.data["userEnrollments"]; // Getting user enrollments from route data
            if (storedEnrollments.length > 0) {
                // Setting courses from resolved data if enrollments exist
                this.courses.set(this.activatedRotue.snapshot.data["userCourses"]);
            }
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to retrieve the student's courses.");
        }
    }

    public handleUnenrolled(courseId: string) {
        // Removing the unenrolled course from the list
        this.courses.set(this.courses().filter(course => course.id !== courseId));
    }


}


