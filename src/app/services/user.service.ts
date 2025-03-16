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

    // Constructor to initialize the user from the token if available
    public constructor() {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
        if (this.userStore.RoleName() === "Student") {
             this.getStudentEnrollments(this.userStore.user()?.id);            
             this.getStudentProgresses(this.userStore.user()?.id);
        }
    }

    // Register a new user
    public async register(user: CreateUserModel): Promise<void> {
        const token$ = this.http.post(environment.usersUrl + "register", user, { responseType: "text" });
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        localStorage.setItem("token", token);
        this.userStore.initUser(dbUser);
    }

    // Login a user
    public async login(credentials: CredentialsModel): Promise<void> {
        const token$ = this.http.post(environment.usersUrl + "login", credentials, { responseType: "text" });
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        localStorage.setItem("token", token);
        this.userStore.initUser(dbUser);
        if (this.userStore.RoleName() === "Student") {
            this.getStudentEnrollments(this.userStore.user()?.id);
            this.getStudentProgresses(this.userStore.user()?.id);
        }
    }

    // Logout the user
    public logout(): void {
        this.userStore.logoutUser();
        this.enrollmentStore.clearEnrollment();
        this.progressStore.clearProgresses();
        localStorage.removeItem("token");
    }

    // Enroll a student in a course
    public async enrollStudent(enrollment: EnrollmentModel): Promise<void> {
        const dbEnrollment$ = this.http.post<EnrollmentModel>(environment.usersUrl + "enroll-to-course", enrollment);
        const dbEnrollment = await firstValueFrom(dbEnrollment$);
        this.enrollmentStore.addEnrollment(dbEnrollment);
    }

    // Unenroll a student from a course
    public async unenrollStudent(enrollmentId: string): Promise<void> {
        const dbEnrollment$ = this.http.delete<void>(environment.usersUrl + `unenroll/${enrollmentId}`);
        await firstValueFrom(dbEnrollment$);
        const courseId = this.enrollmentStore.enrollments().find(e => e.id === enrollmentId).courseId;
        const courseLessons = await this.lessonService.getLessonsByCourse(courseId);
        this.progressStore.initProgresses(this.progressStore.progresses().filter(p => !courseLessons.some(l => l.id === p.lessonId)));
        this.enrollmentStore.deleteEnrollment(enrollmentId);
    }

    // Get all enrollments for a student
    public async getStudentEnrollments(studentId: string): Promise<EnrollmentModel[]> {
        if (this.enrollmentStore.enrollments()?.length > 0) return this.enrollmentStore.enrollments();
        const enrollments$ = this.http.get<EnrollmentModel[]>(environment.usersUrl + `enrollments/${studentId}`);
        const enrollments = await firstValueFrom(enrollments$);
        this.enrollmentStore.initEnrollments(enrollments);
        return enrollments;
    }

    // Get enrollment by course ID
    public async getEnrollmentByCourse(courseId: string): Promise<EnrollmentModel> {
        return await this.enrollmentStore.enrollments().filter(e => e.courseId === courseId)[0];
    }

    // Get all courses a student is enrolled in
    public async getStudentCourses(studentId: string): Promise<CourseModel[]> {
        const enrollments = await this.getStudentEnrollments(studentId);
        const courses = (await this.courseService.getAllCourses()).filter(c => enrollments.some(e => e.courseId === c.id));
        return courses;
    }

    // Get all progress records for a student
    public async getStudentProgresses(studentId: string): Promise<ProgressModel[]> {
        if (this.progressStore.progresses()?.length > 0) return this.progressStore.progresses();
        const progresses$ = this.http.get<ProgressModel[]>(environment.usersUrl + `progress-by-user/${studentId}`);
        const progresses = await firstValueFrom(progresses$);
        this.progressStore.initProgresses(progresses);
        return progresses;
    }

    // Get progress of a student in a specific course
    public async getStudentProgressInCourse(studentId: string, courseId: string): Promise<Progress> {
        const progresses = await this.getStudentProgresses(studentId);
        const lessons = await this.lessonService.getLessonsByCourse(courseId);
        const watchedLessons = lessons.filter(l => progresses.some(p => p.lessonId == l.id));
        const progress = new Progress();
        progress.watched = watchedLessons?.length;
        progress.total = lessons?.length;
        return progress;
    }

    // Mark a lesson as watched
    public async watchLesson(createProgress: CreateProgressModel): Promise<void> {
        const progress$ = this.http.post<ProgressModel>(environment.usersUrl + "progresses", createProgress);
        const progress = await firstValueFrom(progress$);
        this.progressStore.addProgress(progress);
    }

    // Check if a student is enrolled in a course
    public isEnrolled(courseId: string): boolean {
        return this.enrollmentStore.enrollments()?.some(e => e.courseId === courseId);
    }

    // Get the role name of the current user
    public getUserRoleName(): string {
        return this.userStore.RoleName();
    }
}
