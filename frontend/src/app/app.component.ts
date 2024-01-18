import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";
import {LoginCreds} from "./models/login-creds";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'quiz-place';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  showDashboard: boolean = false;

  constructor(
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private auth: AuthService
    ) {
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.successful) {
        this.isLoggedIn = true;
        this.isAdmin = result.isAdmin;
        this.snackbar.open('You are now logged in.');
      } else {
        this.snackbar.open(`Not logged in.`);
      }
    });
  }

  logOut() {
    this.auth.signOut();
    this.isAdmin = false;
  }

  toggleDashboard() {
    this.showDashboard = !this.showDashboard;
  }
}
