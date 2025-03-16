import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CourseModel } from "../models/course.model"
import { computed } from "@angular/core";
import { environment } from "../../environments/environment";
import { withDevtools } from "@angular-architects/ngrx-toolkit";

export type CourseState = {
    courses: CourseModel[];
}

const initialState: CourseState = {
    courses: []
}

// Signal store for managing courses
export const CourseStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    // Define store methods for state mutations
    withMethods(store => ({
        initCourses(courses: CourseModel[]): void {
            patchState(store, _currentState => ({ courses }));
        },
        addCourse(course: CourseModel): void {
            patchState(store, currentState => ({ courses: [...currentState.courses, course] }));
        },
        updateCourse(course: CourseModel): void {
            patchState(store, currentState => ({ courses: currentState.courses.map(c => c.id === course.id ? course : c) }));
        },
        deleteCourse(id: string): void {
            patchState(store, currentState => ({ courses: currentState.courses.filter(c => c.id !== id) }));
        }
    })),
    // Define computed properties for derived state values
    withComputed(store => ({
        count: computed(() => store.courses().length)
    })),
    // Enable devtools only in development mode for easier debugging
    environment.isDevelopment && withDevtools("CourseStore")
)