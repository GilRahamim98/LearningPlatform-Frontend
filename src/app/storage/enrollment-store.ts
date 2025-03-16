import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CourseModel } from "../models/course.model";
import { EnrollmentModel } from "../models/enrollment.model";
import { environment } from "../../environments/environment";
import { withDevtools } from "@angular-architects/ngrx-toolkit";

export type EnrollmentState = {
    enrollments: EnrollmentModel[];
}

const initialState: EnrollmentState = {
    enrollments: null
}

// Signal store for managing enrollments
export const EnrollmentStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    // Defines methods for manipulating the store's state
    withMethods(store => ({
        initEnrollments(enrollments: EnrollmentModel[]): void {
            patchState(store, _currentState => ({ enrollments }));
        },
        addEnrollment(enrollment: EnrollmentModel): void {
            patchState(store, currentState => ({ enrollments: [...currentState.enrollments, enrollment] }));
        },
        deleteEnrollment(id: string): void {
            patchState(store, currentState => ({ enrollments: currentState.enrollments.filter(e => e.id !== id) }));
        },
        clearEnrollment(): void {
            patchState(store, _currentState => ({ enrollments: [] as EnrollmentModel[] }));
        }
    })),
    // Enables developer tools only in development mode for easier debugging
    environment.isDevelopment && withDevtools("EnrollmentStore")


)