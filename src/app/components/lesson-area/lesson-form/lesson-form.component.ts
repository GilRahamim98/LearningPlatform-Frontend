import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-lesson-form',
    imports: [CommonModule,ReactiveFormsModule,MatFormFieldModule,MatCardModule,MatInputModule],
    templateUrl: './lesson-form.component.html',
    styleUrl: './lesson-form.component.css',
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class LessonFormComponent {
    @Input()
    public lessonForm!: FormGroup;

}
