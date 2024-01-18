import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserEnvComponent } from './user-env/user-env.component';
import { AdminEnvComponent } from './admin-env/admin-env.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuestionComponent } from './user-env/question/question.component';
import { QuestionCarouselComponent } from './user-env/question-carousel/question-carousel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {authInterceptorProviders} from "./services/auth-interceptor.service";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import { NewCourseDialogComponent } from './admin-env/new-course-dialog/new-course-dialog.component';
import { QuestionPanelComponent } from './admin-env/question-panel/question-panel.component';
import { NewQuestionDialogComponent } from './admin-env/new-question-dialog/new-question-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        UserEnvComponent,
        AdminEnvComponent,
        QuestionComponent,
        QuestionCarouselComponent,
        LoginDialogComponent,
        AdminEnvComponent,
        NewCourseDialogComponent,
        QuestionPanelComponent,
        NewQuestionDialogComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressBarModule,
        FormsModule,
        MatDividerModule,
        MatButtonModule,
        HttpClientModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        MatExpansionModule,
    ],
  providers: [
    authInterceptorProviders,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
