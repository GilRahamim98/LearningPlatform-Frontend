import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { environment } from "../../environments/environment";
import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { ProgressModel } from "../models/progress.model";

export type ProgressState = {
    progresses: ProgressModel[];
}

const initialState: ProgressState = {
    progresses: null
}

// Signal store for managing progress tracking
export const ProgressStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    // Define methods to manipulate the store's state
    withMethods(store => ({
        initProgresses(progresses: ProgressModel[]): void {
            patchState(store, _currentState => ({ progresses }));
        },
        addProgress(progress: ProgressModel): void {
            patchState(store, currentState => ({ progresses: [...currentState.progresses, progress] }));
        },
        deleteProgress(id: string): void {
            patchState(store, currentState => ({ progresses: currentState.progresses.filter(p => p.id !== id) }));
        },
        clearProgresses(): void {
            patchState(store, _currentState => ({ progresses: [] as ProgressModel[] }));
        }
    })),
    // Enables developer tools only in development mode for easier debugging
    environment.isDevelopment && withDevtools("ProgressStore")
)