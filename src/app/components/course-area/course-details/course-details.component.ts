import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { LessonService } from '../../../services/lesson.service';
import { LessonModel } from '../../../models/lesson.model';
import { LessonCardComponent } from '../../lesson-area/lesson-card/lesson-card.component';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule,MatCardModule,MatButtonModule,MatIconModule,LessonCardComponent],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
    public course:CourseModel;
    public lessons:LessonModel[] =[];
    public constructor(
        private activatedRoute: ActivatedRoute,
        private courseService:CourseService,
        private lessonService:LessonService
    ){}

    public async ngOnInit() {
        try{
            const id = this.activatedRoute.snapshot.params["id"];
            this.course = await this.courseService.getOneCourse(id);
            this.lessons = await this.lessonService.getLessonsByCourse(id);
        }catch(err:any){
            console.log(err);
        }
    }



}
