import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports:[MatCardModule,MatIconModule,MatFormFieldModule,MatInputModule,MatListModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {



}