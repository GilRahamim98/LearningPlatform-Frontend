import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-course-dialog',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './delete-course-dialog.component.html',
  styleUrl: './delete-course-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCourseDialogComponent {
}
