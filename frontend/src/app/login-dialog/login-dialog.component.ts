import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoginCreds} from "../models/login-creds";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  hide: boolean = true;
  loginCreds: LoginCreds = new LoginCreds("", "");
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.authService.login(
      this.loginCreds.username,
      this.loginCreds.password
    ).subscribe({
      next: (data) => {
        this.authService.saveToken(data.token, data.isAdmin);
        this.dialogRef.close({
          successful: true,
          isAdmin: data.isAdmin,
          errorMessage: null,
        });
      },
      error: (data) => {
        this.dialogRef.close({
          successful: false,
          errorMessage: "Not logged in.",
        });
      }
    });
  }
}
