import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from '../../../models/course.model';
import { LessonModel } from '../../../models/lesson.model';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { NotificationService } from '../../../services/notification.service';
import { EditCourseDialogComponent } from '../../dialogs/course-dialogs/edit-course-dialog/edit-course-dialog.component';
import { LessonFormComponent } from '../../lesson-area/lesson-form/lesson-form.component';
import { MatIcon } from '@angular/material/icon';
import { DiscardDialogComponent } from '../../dialogs/course-dialogs/discard-dialog/discard-dialog.component';

@Component({
    selector: 'app-course-form',
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, LessonFormComponent],
    templateUrl: './course-form.component.html',
    styleUrl: './course-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseFormComponent implements OnInit {
    public courseForm: FormGroup;
    public course: CourseModel;
    private originalLessons: LessonModel[] = [];
    public isEdit = false; // Flag to check if the form is in edit mode

    public constructor(
        private formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute,
        private courseService: CourseService,
        private lessonService: LessonService,
        private notificationService: NotificationService,
        readonly dialog: MatDialog,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    // Initialize the component
    public async ngOnInit() {
        const id = this.activeRoute.snapshot.params["id"];
        if (id) {
            // If an ID is present, the form is in edit mode
            this.isEdit = true;
            this.course = await this.courseService.getCourseById(id);
            this.originalLessons = await this.lessonService.getLessonsByCourse(id);
            const lessonForms = this.originalLessons.map((lesson: LessonModel) => this.formBuilder.group({
                id: lesson.id,
                titleControl: new FormControl(lesson.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                videoControl: new FormControl(lesson.videoUrl, [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)?$/)])
            }));

            this.courseForm = this.formBuilder.group({
                titleControl: new FormControl(this.course.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                descriptionControl: new FormControl(this.course.description, [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]),
                lessons: this.formBuilder.array(lessonForms)
            });
            this.cdr.markForCheck();

        } else {
            // If no ID is present, the form is in create mode
            this.courseForm = this.formBuilder.group({
                titleControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                descriptionControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]),
                lessons: this.formBuilder.array([])
            });
        }
    }

    // Getter for the lessons form array
    public get lessons(): FormArray {
        return this.courseForm.get('lessons') as FormArray;
    }

    // Add a new lesson to the lessons form array
    public addLesson(): void {
        const lessonForm = this.formBuilder.group({
            id: new FormControl(undefined),
            titleControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            videoControl: new FormControl("", [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)?$/)]),

        });
        this.lessons.push(lessonForm);
    }

    // Remove a lesson from the lessons form array
    public removeLesson(index: number): void {
        this.lessons.removeAt(index);
    }

    // Add a new course
    public async addCourse() {
        try {
            const title = this.courseForm.get('titleControl')?.value;
            const description = this.courseForm.get('descriptionControl')?.value;
            const course: CourseModel = new CourseModel();
            course.title = title;
            course.description = description;
            course.createdAt = new Date();
            const dbCourse = await this.courseService.addCourse(course);
            const lessons = this.courseForm.get('lessons')?.value;
            const lessonsModel: LessonModel[] = lessons.map((lesson: any): LessonModel => ({
                id: undefined,
                title: lesson.titleControl,
                videoUrl: lesson.videoControl,
                courseId: dbCourse.id
            }));
            this.lessonService.addLessons(lessonsModel);
            this.notificationService.success("Course added successfully");
            this.router.navigateByUrl('/courses');

        } catch (err: any) {
            this.notificationService.error(err.message);
        }
    }

    // Edit an existing course
    public async editCourse() {
        try {
            const title = this.course.title !== this.courseForm.get('titleControl')?.value ? this.courseForm.get('titleControl')?.value : this.course.title;
            const description = this.course.description !== this.courseForm.get('descriptionControl')?.value ? this.courseForm.get('descriptionControl')?.value : this.course.description;
            const course: CourseModel = new CourseModel();
            course.title = title;
            course.description = description;
            course.createdAt = this.course.createdAt;
            course.id = this.course.id;
            const dbCourse = await this.courseService.updateCourse(course);
            const formLessons = this.courseForm.get('lessons')?.value;

            const newLessons: LessonModel[] = [];
            const updatedLessons: LessonModel[] = [];
            const deletedLessonIds: string[] = [];
            formLessons.forEach((formLesson: any) => {
                const lesson: LessonModel = {
                    id: formLesson.id,
                    title: formLesson.titleControl,
                    videoUrl: formLesson.videoControl,
                    courseId: dbCourse.id
                };
                if (!lesson.id) {
                    newLessons.push(lesson);
                } else {
                    const originalLesson = this.originalLessons.find(l => l.id === lesson.id);

                    if (originalLesson &&
                        (originalLesson.title !== lesson.title ||
                            originalLesson.videoUrl !== lesson.videoUrl)) {

                        updatedLessons.push(lesson);
                    }
                }
            });

            this.originalLessons.forEach(originalLesson => {
                const stillExists = formLessons.some((formLesson: any) => formLesson.id === originalLesson.id);
                if (!stillExists) {
                    deletedLessonIds.push(originalLesson.id);
                }
            });
            if (newLessons.length > 0) {
                await this.lessonService.addLessons(newLessons);
            }

            if (updatedLessons.length > 0) {
                await this.lessonService.updateLessons(updatedLessons);
            }

            if (deletedLessonIds.length > 0) {
                await this.lessonService.deleteLessons(deletedLessonIds);
            }
            this.notificationService.success("Course updated successfully");
            this.router.navigateByUrl('/courses');

        } catch (err: any) {
            this.notificationService.error(err.message);
        }
    }

    // Open the edit course dialog
    public openEditDialog(): void {
        const dialogRef = this.dialog.open(EditCourseDialogComponent, {
            width: '250px',
            height: '200px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this.editCourse();
            }
        });
    }

    // Open the discard changes dialog
    public openGoBackDialog(): void {
        const dialogRef = this.dialog.open(DiscardDialogComponent, {
            width: '250px',
            height: '200px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                this.router.navigateByUrl('/courses');
            }
        });
    }
}
