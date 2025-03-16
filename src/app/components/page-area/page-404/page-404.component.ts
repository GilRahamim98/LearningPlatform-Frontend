import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-404',
  imports: [RouterLink,MatCardModule,MatButton],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Page404Component {

}
