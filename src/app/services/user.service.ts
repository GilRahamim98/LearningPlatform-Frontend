import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStore } from '../storage/user-store';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CredentialsModel } from '../models/credentials.model';
import { CreateUserModel } from '../models/createUser.model';
import { EnrollmentStore } from '../storage/enrollment-store';
import { CourseModel } from '../models/course.model';
import { ProgressModel } from '../models/progress.model';
import { LessonService } from './lesson.service';
import { Progress } from '../utils/types';
import { CreateProgressModel } from '../models/createProgress.model';
import { EnrollmentModel } from '../models/enrollment.model';
import { CourseService } from './course.service';
import { ProgressStore } from '../storage/progress-store';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private courseService = inject(CourseService);
    private userStore = inject(UserStore);
    private enrollmentStore = inject(EnrollmentStore);
    private progressStore = inject(ProgressStore);
    private lessonService = inject(LessonService);

    public constructor() {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
        if (this.userStore.RoleName() === "Student") {
            this.getStudentEnrollments(this.userStore.user()?.id);
            this.getStudentProgress(this.userStore.user()?.id);
        }
    }

    public async register(user: CreateUserModel): Promise<void> {
        const token$ = this.http.post(environment.usersUrl + "register", user, { responseType: "text" });
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
        localStorage.setItem("token", token);
    }


    public async login(credentials: CredentialsModel): Promise<void> {
        const token$ = this.http.post(environment.usersUrl + "login", credentials, { responseType: "text" });
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
        this.getStudentEnrollments(this.userStore.user()?.id);
        this.getStudentProgress(this.userStore.user()?.id);
        localStorage.setItem("token", token);
    }

    public logout(): void {
        this.userStore.logoutUser();
        this.enrollmentStore.clearEnrollment();
        this.progressStore.clearProgresses();
        localStorage.removeItem("token");
    }

    public async enrollStudent(enrollment: EnrollmentModel): Promise<void> {
        const dbEnrollment$ = this.http.post<EnrollmentModel>(environment.usersUrl + "enroll-to-course", enrollment);
        const dbEnrollment = await firstValueFrom(dbEnrollment$);
        this.enrollmentStore.addEnrollment(dbEnrollment);
    }

    public async unenrollStudent(enrollmentId: string): Promise<void> {
        const dbEnrollment$ = this.http.delete<void>(environment.usersUrl + `unenroll/${enrollmentId}`);
        await firstValueFrom(dbEnrollment$);
        const courseId = this.enrollmentStore.enrollments().find(e => e.id === enrollmentId).courseId;
        const courseLessons = await this.lessonService.getLessonsByCourse(courseId);
        this.progressStore.initProgresses(this.progressStore.progresses().filter(p => !courseLessons.some(l => l.id === p.lessonId)));
        this.enrollmentStore.deleteEnrollment(enrollmentId);
    }

    public async getStudentEnrollments(studentId: string): Promise<EnrollmentModel[]> {
        if (this.enrollmentStore.enrollments()?.length > 0) return this.enrollmentStore.enrollments();
        const enrollments$ = this.http.get<EnrollmentModel[]>(environment.usersUrl + `enrollments/${studentId}`);
        const enrollments = await firstValueFrom(enrollments$);
        this.enrollmentStore.initEnrollments(enrollments);
        return enrollments;
    }

    public async getEnrollmentByCourse(courseId: string): Promise<EnrollmentModel> {
        return await this.enrollmentStore.enrollments().filter(e => e.courseId === courseId)[0];
    }

    public async getStudentCourses(studentId: string): Promise<CourseModel[]> {
        const enrollments = await this.getStudentEnrollments(studentId);
        const courses = (await this.courseService.getAllCourses()).filter(c => enrollments.some(e => e.courseId === c.id));
        return courses;
    }

    public async getStudentProgress(studentId: string): Promise<ProgressModel[]> {
        if (this.progressStore.progresses()?.length > 0) return this.progressStore.progresses();
        const progresses$ = this.http.get<ProgressModel[]>(environment.usersUrl + `progress-by-user/${studentId}`);
        const progresses = await firstValueFrom(progresses$);
        this.progressStore.initProgresses(progresses);
        return progresses;
    }

    public async getStudentProgressInCourse(studentId: string, courseId: string): Promise<Progress> {
        const progresses = await this.getStudentProgress(studentId);
        const lessons = await this.lessonService.getLessonsByCourse(courseId);
        const watchedLessons = lessons.filter(l => progresses.some(p => p.lessonId == l.id));
        const progress = new Progress();
        progress.watched = watchedLessons?.length;
        progress.total = lessons?.length;

        return progress;
    }

    public async watchLesson(createProgress: CreateProgressModel): Promise<void> {
        const progress$ = this.http.post<ProgressModel>(environment.usersUrl + "progresses", createProgress);
        const progress = await firstValueFrom(progress$);
        this.progressStore.addProgress(progress);
    }

    public isEnrolled(courseId: string): boolean {
        return this.enrollmentStore.enrollments()?.some(e => e.courseId === courseId);
    }

    public getUserRoleName():string{
        return this.userStore.RoleName();
    }
}
