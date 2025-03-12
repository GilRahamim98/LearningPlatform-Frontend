import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-unenroll-dialog',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './unenroll-dialog.component.html',
    styleUrl: './unenroll-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnenrollDialogComponent {

}
