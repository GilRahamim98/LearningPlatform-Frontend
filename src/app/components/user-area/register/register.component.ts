import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CreateUserModel } from '../../../models/createUser.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

    private user = new CreateUserModel();
    public userForm :FormGroup;

    public constructor(
        private userService:UserService,
        private router:Router,
        private formBuilder:FormBuilder
    ){}

    public ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            nameControl:new FormControl(""),
            emailControl:new FormControl(""),
            passwordControl:new FormControl(""),
            roleControl:new FormControl("",[Validators.min(1),Validators.max(2)])
        })
    }

    public async send(){
        try{
            this.user.name = this.userForm.get("nameControl").value;
            this.user.email = this.userForm.get("emailControl").value;
            this.user.password = this.userForm.get("passwordControl").value;
            this.user.roleId = this.userForm.get("roleControl").value;

            await this.userService.register(this.user);
            this.router.navigateByUrl("/home");
        }catch(err:any){
            console.log(err.error);
        }
    }

}
