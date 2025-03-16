import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserModel } from "../models/user.model"
import { computed } from "@angular/core";
import { environment } from "../../environments/environment";
import { withDevtools } from "@angular-architects/ngrx-toolkit";

export type UserState = {
    user: UserModel;
}

const initialState: UserState = {
    user: null
}

// Signal store for managing user data
export const UserStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    // Define methods for manipulating the store's state
    withMethods(store => ({
        initUser(user: UserModel): void {
            patchState(store, _currentState => ({ user }));
        },
        logoutUser(): void {
            patchState(store, _currentState => ({ user: null as UserModel }));
        }
    })),
    // Define computed properties for derived state values
    withComputed(store => ({
        RoleName: computed(() =>{
            const user = store.user();
            if (user?.roleId === 3) return "Admin";
            if (user?.roleId === 1) return "Student";
            if (user?.roleId === 2) return "Instructor";
            return "Unknown";
        })
    })),
    // Enables developer tools only in development mode for easier debugging
    environment.isDevelopment && withDevtools("UserStore")
)