import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CredentialsModel } from '../../../models/credentials.model';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatCardModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

    private credentials = new CredentialsModel();
    public credentialsForm: FormGroup;

    public constructor(
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService
    ){}

    public ngOnInit(): void {
        this.credentialsForm = this.formBuilder.group({
            emailControl: new FormControl("", [Validators.required, Validators.maxLength(100), Validators.email]),
            passwordControl: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(100)])
        });
    }

    public async send() {
        try {
            this.credentials.email = this.credentialsForm.get("emailControl").value;
            this.credentials.password = this.credentialsForm.get("passwordControl").value;
            await this.userService.login(this.credentials);
            this.notificationService.success("Welcome Back!");
         
            this.router.navigateByUrl("/home");
        } catch (err: any) {
            this.notificationService.error(JSON.parse(err.error)?.errors);         
          
        }
    }

}
