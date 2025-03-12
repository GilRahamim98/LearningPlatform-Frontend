import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CourseService } from '../../../services/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { AddLessonComponent } from '../../lesson-area/add-lesson/add-lesson.component';
import { CourseModel } from '../../../models/course.model';
import { LessonModel } from '../../../models/lesson.model';
import { LessonService } from '../../../services/lesson.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCourseDialogComponent } from '../../dialogs/course-dialogs/edit-course-dialog/edit-course-dialog.component';

@Component({
    selector: 'app-course-form',
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, AddLessonComponent],
    templateUrl: './course-form.component.html',
    styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnInit {
    public courseForm: FormGroup;
    public course: CourseModel;
    private originalLessons: LessonModel[] = [];
    public isEdit = false;



    public constructor(
        private formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute,
        private courseService: CourseService,
        private lessonService: LessonService,
        private notificationService: NotificationService,
        readonly dialog: MatDialog,
        private router: Router
    ) { }

    public async ngOnInit() {
        const id = this.activeRoute.snapshot.params["id"];
        if (id) {
            this.isEdit = true;
            this.course = await this.courseService.getCourseById(id);
            this.originalLessons = await this.lessonService.getLessonsByCourse(id);
            const lessonForms = this.originalLessons.map((lesson: LessonModel) => this.formBuilder.group({
                id: lesson.id,
                titleControl: new FormControl(lesson.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                videoControl: new FormControl(lesson.videoUrl, [Validators.required, Validators.pattern('https?://.+')])
            }));

            this.courseForm = this.formBuilder.group({
                titleControl: new FormControl(this.course.title, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                descriptionControl: new FormControl(this.course.description, [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]),
                lessons: this.formBuilder.array(lessonForms)
            });
        } else {
            this.courseForm = this.formBuilder.group({
                titleControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                descriptionControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]),
                lessons: this.formBuilder.array([])
            });
        }
    }

    public get lessons(): FormArray {
        return this.courseForm.get('lessons') as FormArray;
    }

    public addLesson(): void {
        const lessonForm = this.formBuilder.group({
            id: new FormControl(undefined),
            titleControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            videoControl: new FormControl("", [Validators.required, Validators.pattern('https?://.+')]),

        });
        this.lessons.push(lessonForm);
    }

    public removeLesson(index: number): void {
        this.lessons.removeAt(index);
    }

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

            for (const lesson of updatedLessons) {
                await this.lessonService.updateLesson(lesson);
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

    public openEditDialog(): void {
        const dialogRef = this.dialog.open(EditCourseDialogComponent, {
            width: '250px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                await this.editCourse();
            }
        });
    }
}
