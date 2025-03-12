import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-add-lesson',
    imports: [CommonModule,ReactiveFormsModule,MatFormFieldModule,MatCardModule,MatInputModule],
    templateUrl: './add-lesson.component.html',
    styleUrl: './add-lesson.component.css'
})
export class AddLessonComponent implements OnInit {
    @Input()
    public lessonForm!: FormGroup;

    public constructor(
        private formBuilder: FormBuilder,
        private lessonService: LessonService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    public ngOnInit(): void {

    }

 
}
