import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserModel } from '../../../models/user.model';
import { UserStore } from '../../../storage/user-store';
import { EnrollmentStore } from '../../../storage/enrollment-store';
import { EnrollmentListComponent } from '../../enrollment-area/enrollment-list/enrollment-list.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, EnrollmentListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit{
    public user:UserModel;

    public userStore = inject(UserStore);
    public enrollmentStore = inject(EnrollmentStore);

    public ngOnInit(): void {        
        this.user = this.userStore.user();
    }

}
