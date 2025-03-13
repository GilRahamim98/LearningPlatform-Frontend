import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatSliderModule,
        MatProgressBarModule,
        MatIconModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
        ],
    styleUrls: ['./home.component.css'],
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class HomeComponent {



}