import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CredentialsModel } from '../../../models/credentials.model';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    private credentials = new CredentialsModel();
    public credentialsForm :FormGroup;

    public constructor(
        private userService:UserService,
        private router:Router,
        private formBuilder:FormBuilder
    ){}

    public ngOnInit():void{
        this.credentialsForm = this.formBuilder.group({
            emailControl: new FormControl(""),
            passwordControl :new FormControl("")
        });
    }

    public async send(){
        try {
            this.credentials.email = this.credentialsForm.get("emailControl").value;
            this.credentials.password = this.credentialsForm.get("passwordControl").value;
            await this.userService.login(this.credentials);
            this.router.navigateByUrl("/home");
        }catch(err:any){
            console.log(err.error);
        }
    }

}
