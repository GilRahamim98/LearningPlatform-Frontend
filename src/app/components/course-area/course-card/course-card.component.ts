import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CourseModel } from '../../../models/course.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-course-card',
    imports: [MatCardModule, MatChipsModule, MatProgressBarModule,MatIconModule,MatButtonModule],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
    @Input()
    public course:CourseModel;
}
