import { Component, OnInit } from '@angular/core';
import { CourseModel } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from "../course-card/course-card.component";

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {

    public courses: CourseModel[] = [];
    public constructor(private courseService:CourseService,private router:Router){}
    public async ngOnInit(){
        try{
            this.courses = await this.courseService.getAllCourses();
        }catch(err:any){
            alert(err.message);
        }
    }
}
