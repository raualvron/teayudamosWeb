import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

// Reactive Form
import { ReactiveFormsModule } from "@angular/forms";

// App routing modules
import { AppRoutingModule } from "./shared/routing/app-routing.module";

// App components
import { AppComponent } from "./app.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { SchoolComponent } from "./components/school/school.component";
import { RegistrationComponent } from "./components/registration/registration.component";

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "../environments/environment";

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { AlertComponent } from "./shared/helpers/alert/alert.component";

import { MenuAsideComponent } from "./shared/helpers/menu-aside/menu-aside.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { TeachersComponent } from "./components/teachers/teachers.component";
import { ModalComponent } from "./shared/helpers/modal/modal.component";
import { AlumnsComponent } from "./components/alumns/alumns.component";
import { MedicineComponent } from "./components/medicine/medicine.component";
import { ChatComponent } from "./components/chat/chat.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/es";
import { RecordsComponent } from "./components/records/records.component";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { RoutesComponent } from "./components/routes/routes.component";

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    AlertComponent,
    ModalComponent,
    SchoolComponent,
    RegistrationComponent,
    TeachersComponent,
    MenuAsideComponent,
    ModalComponent,
    AlumnsComponent,
    MedicineComponent,
    ChatComponent,
    RecordsComponent,
    RoutesComponent,
  ],
  imports: [
    NgxSpinnerModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [AlertComponent, ModalComponent],
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
