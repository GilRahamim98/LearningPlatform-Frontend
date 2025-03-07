import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStore } from '../storage/user-store';
import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../models/user.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CredentialsModel } from '../models/credentials.model';
import { CreateUserModel } from '../models/createUser.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);
    private userStore = inject(UserStore);

    public constructor(){
        const token = localStorage.getItem("token");
        if(!token) return;
        const payload = jwtDecode<{user: string}>(token);
        const dbUser =JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
    }

    public async register(user:CreateUserModel):Promise<void>{
            const token$ = this.http.post(environment.usersUrl+"register",user,{responseType:"text"});
            const token = await firstValueFrom(token$);
            const payload = jwtDecode<{user: string}>(token);
            const dbUser =JSON.parse(payload.user);
            this.userStore.initUser(dbUser);
            localStorage.setItem("token",token);
    }

   
    public async login(credentials: CredentialsModel): Promise<void> {
        const token$ = this.http.post(environment.usersUrl+"login", credentials,{responseType:"text"});
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: string }>(token);
        const dbUser = JSON.parse(payload.user);
        this.userStore.initUser(dbUser);
        localStorage.setItem("token", token);
    }

    public logout(): void {
        this.userStore.logoutUser();
        localStorage.removeItem("token");
    }
}
