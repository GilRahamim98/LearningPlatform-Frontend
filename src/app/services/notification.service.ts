import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    private snackBar= inject(MatSnackBar);

    public success(message: string): void {
        this.snackBar.open(message, 'X', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ["success-snackbar"]
        })
    }

    public error(message: string): void {
        this.snackBar.open(message, 'X', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ["error-snackbar"]
        })
    }

}
