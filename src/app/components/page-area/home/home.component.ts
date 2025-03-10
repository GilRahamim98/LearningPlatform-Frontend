import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports:[CommonModule,FormsModule,MatCardModule,MatIconModule,MatFormFieldModule,MatInputModule,MatListModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchQuery: string = '';
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic goes here if needed
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/courses'], { 
        queryParams: { search: this.searchQuery }
      });
    }
  }


}