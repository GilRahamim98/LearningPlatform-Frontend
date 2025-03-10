import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CourseModel } from "../models/course.model";
import { EnrollmentModel } from "../models/enrollment.model";

export type EnrollmentState = {
    enrollments: EnrollmentModel[];
}

const initialState: EnrollmentState = {
    enrollments: null
}

export const EnrollmentStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
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



)