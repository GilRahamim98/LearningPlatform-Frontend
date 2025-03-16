import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { CourseService } from '../../../services/course.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCourseDialogComponent } from '../../dialogs/course-dialogs/delete-course-dialog/delete-course-dialog.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-course-card',
    imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatIconModule, MatButtonModule],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCardComponent implements OnInit {
    public router = inject(Router);
    public userStore = inject(UserStore);
    public userService = inject(UserService);
    public courseService = inject(CourseService);
    public enrollmentStore = inject(EnrollmentStore);
    private dialog = inject(MatDialog);
    private notificationService = inject(NotificationService);
    public isEnrolled: boolean;

    @Output()
    public deletedCourse = new EventEmitter<string>();

    @Input()
    public course: CourseModel;

    public ngOnInit() {
        // Check if the user is enrolled in the course
        this.isEnrolled = this.userService.isEnrolled(this.course.id);
    }

    public displayDetails() {
        this.router.navigateByUrl("/courses/" + this.course.id);
    }

    public enrollStudent(): void {
        // Create a new enrollment and enroll the user in the course
        const enrollment = new EnrollmentModel();
        enrollment.courseId = this.course.id;
        enrollment.userId = this.userStore.user().id;
        enrollment.createdAt = new Date();
        this.userService.enrollStudent(enrollment);
        this.isEnrolled = true;
    }

    public editCourse(): void {
        this.router.navigateByUrl("/courses/edit/" + this.course.id);
    }

    public async deleteCourse() {
        try {
            // Delete the course and emit the deleted course ID
            await this.courseService.deleteCourse(this.course.id);
            this.deletedCourse.emit(this.course.id);
            this.notificationService.success("Course deleted successfully");
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to delete the course");
        }
    }


    public openDeleteDialog(): void {
        // Open the delete course confirmation dialog
        const dialogRef = this.dialog.open(DeleteCourseDialogComponent, {
            width: '250px',
            height: '200px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this.deleteCourse();
            }
        });
    }


}
