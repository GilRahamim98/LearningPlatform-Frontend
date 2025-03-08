import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserModel } from '../../../models/user.model';
import { UserStore } from '../../../storage/user-store';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,MatCardModule,MatButtonModule,MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
    public user:UserModel;

    public userStore = inject(UserStore);

    public ngOnInit(): void {
        this.user = this.userStore.user();
    }

}
