import { Component,inject } from '@angular/core';
import { LogoComponent } from "../logo/logo.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../storage/user-store';
import { UserService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule,MatToolbarModule,LogoComponent,MatIconModule,MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    public userStore = inject(UserStore);
    public userService = inject(UserService);

    public logout():void{
        this.userService.logout();
    }
}
