import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-discard-dialog',
    imports: [MatButtonModule,MatDialogModule],
    templateUrl: './discard-dialog.component.html',
    styleUrl: './discard-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscardDialogComponent {

}
