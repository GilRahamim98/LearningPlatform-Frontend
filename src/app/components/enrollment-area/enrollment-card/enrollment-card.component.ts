import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { UserStore } from '../../../storage/user-store';
import { Progress } from '../../../utils/types';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import JSConfetti from 'js-confetti';
import { NotificationService } from '../../../services/notification.service';
import { UnenrollDialogComponent } from '../../dialogs/user-dialogs/unenroll-dialog/unenroll-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-enrollment-card',
    imports: [CommonModule, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule],
    templateUrl: './enrollment-card.component.html',
    styleUrl: './enrollment-card.component.css',
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class EnrollmentCardComponent implements OnInit {

    private notificationService = inject(NotificationService);
    private userStore = inject(UserStore);
    private userService = inject(UserService);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private cdr = inject(ChangeDetectorRef);

    public mode: ProgressSpinnerMode = 'determinate';
    public value = 0;
    public progress: Progress;

    @Output()
    public unenrolled = new EventEmitter<string>();

    @Input()
    public course: CourseModel;

    public async ngOnInit() {
        this.progress = await this.userService.getStudentProgressInCourse(this.userStore.user().id, this.course.id);
        this.value = (this.progress.total > 0) ? Math.round((this.progress.watched / this.progress.total) * 100) : 0;
        this.cdr.markForCheck();
    }

    public async unenroll() {
        try {
            await this.userService.unenrollStudent((await this.userService.getEnrollmentByCourse(this.course.id)).id);
            this.unenrolled.emit(this.course.id);
            this.notificationService.success("You have successfully unenrolled from this course");
        } catch (err: any) {
            this.notificationService.error("An error occurred while trying to unenroll from this course");
        }
    }



    public congrats() {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
            confettiRadius: 6,
            confettiNumber: 500,
        });
        this.notificationService.success("Congrats, you have completed this course");
    }


    public viewCourseDetails(courseId: string): void {
        this.router.navigateByUrl("/courses/" + courseId);
    }

    public openUnenrollDialog(): void {
        const dialogRef = this.dialog.open(UnenrollDialogComponent, {
            width: '250px',
            height: '200px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this.unenroll();
            }
        });
    }

}
