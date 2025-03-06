import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CourseModel } from '../../../models/course.model';

@Component({
    selector: 'app-course-card',
    imports: [MatCardModule, MatChipsModule, MatProgressBarModule],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
    @Input()
    public course:CourseModel;
    public longText = `The Chihuahua is a Mexican breed of toy dog. It is named for the
  Mexican state of Chihuahua and is among the smallest of all dog breeds. It is
  usually kept as a companion animal or for showing.`;
}
