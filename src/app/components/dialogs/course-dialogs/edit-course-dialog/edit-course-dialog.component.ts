import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-course-dialog',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './edit-course-dialog.component.html',
    styleUrl: './edit-course-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class EditCourseDialogComponent {

}
