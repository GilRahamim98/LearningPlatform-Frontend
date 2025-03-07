import { Component,inject } from '@angular/core';
import { LogoComponent } from "../logo/logo.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../storage/user-store';
import { UserService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule,MatToolbarModule,RouterLink,LogoComponent,MatIconModule],
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
