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
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule, MatRadioModule, MatButtonToggleModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

    private user = new CreateUserModel();
    public userForm: FormGroup;

    public constructor(
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) { }

    public ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            nameControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            emailControl: new FormControl("", [Validators.required, Validators.maxLength(100), Validators.email]),
            passwordControl: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)]),
            roleControl: new FormControl("", [Validators.required, Validators.min(1), Validators.max(2)])
        })
    }

    public async send() {
        try {
            this.user.name = this.userForm.get("nameControl").value;
            this.user.email = this.userForm.get("emailControl").value;
            this.user.password = this.userForm.get("passwordControl").value;
            this.user.roleId = this.userForm.get("roleControl").value;

            await this.userService.register(this.user);
            this.notificationService.success("Welcome!");
            this.router.navigateByUrl("/home");
        } catch (err: any) {
            this.notificationService.error(JSON.parse(err.error)?.errors?.[0]);
        }
    }

}
