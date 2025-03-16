import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserStore } from '../../../storage/user-store';
import { LogoComponent } from "../logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule,MatToolbarModule,LogoComponent,MatIconModule,MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    public userStore = inject(UserStore);
    public userService = inject(UserService);

    public logout():void{
        this.userService.logout();
    }
}
