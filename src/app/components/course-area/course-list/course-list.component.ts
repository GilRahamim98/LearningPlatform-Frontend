import { Component, inject, OnInit } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from "../course-card/course-card.component";
import { CourseStore } from '../../../storage/course-store';

@Component({
    selector: 'app-course-list',
    imports: [CommonModule, CourseCardComponent],
    templateUrl: './course-list.component.html',
    styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {

    public courses: CourseModel[] = [];
    private courseStore = inject(CourseStore);

    public constructor(
        private courseService: CourseService,
        private router: Router
    ) { }
    public async ngOnInit() {
        try {
            console.log();
            
            if (this.courseStore.count() > 0)
                this.courses = this.courseStore.courses();
            else
                this.courses = await this.courseService.getAllCourses();
        } catch (err: any) {
            alert(err.message);
        }
    }
}


