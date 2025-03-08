import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseModel } from '../../../models/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule,MatCardModule,MatButtonModule,MatIconModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
    public course:CourseModel;
    public constructor(
        private activatedRoute: ActivatedRoute,
        private courseService:CourseService
    ){}

    public async ngOnInit() {
        try{
            const id = this.activatedRoute.snapshot.params["id"];
            this.course = await this.courseService.getOneCourse(id);
        }catch(err:any){
            console.log(err);
        }
    }

}
