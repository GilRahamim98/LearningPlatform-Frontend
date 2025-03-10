import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserModel } from "../models/user.model"
import { computed } from "@angular/core";

export type UserState = {
    user: UserModel;
}

const initialState: UserState = {
    user: null
}

export const UserStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    withMethods(store => ({
        initUser(user: UserModel): void {
            patchState(store, _currentState => ({ user }));
        },
        logoutUser(): void {
            patchState(store, _currentState => ({ user: null as UserModel }));
        }
    })),
    withComputed(store => ({
        RoleName: computed(() => store.user()?.roleId === 3 ? "Admin" : store.user()?.roleId === 1 ? "Student" : "Instructor")
    })),

)