import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignInComponent } from "../../components/sign-in/sign-in.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { ForgotPasswordComponent } from "../../components/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "../../components/verify-email/verify-email.component";
import { RegistrationComponent } from "src/app/components/registration/registration.component";

import { AuthGuard } from "../../shared/guard/auth.guard";
import { SchoolComponent } from "src/app/components/school/school.component";
import { TeachersComponent } from "src/app/components/teachers/teachers.component";
import { AlumnsComponent } from "src/app/components/alumns/alumns.component";
import { MedicineComponent } from "src/app/components/medicine/medicine.component";
import { ChatComponent } from "src/app/components/chat/chat.component";
import { RecordsComponent } from "src/app/components/records/records.component";
import { RoutesComponent } from "src/app/components/routes/routes.component";

const routes: Routes = [
  { path: "", redirectTo: "/sign-in", pathMatch: "full" },
  { path: "sign-in", component: SignInComponent },
  { path: "register-user", component: SignUpComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "teachers",
    component: TeachersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "alumns",
    component: AlumnsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "registration",
    component: RegistrationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "alumns/:id/medicine",
    component: MedicineComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "alumns/:id/chat",
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "alumns/:id/records",
    component: RecordsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "alumns/:id/routes",
    component: RoutesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "school",
    component: SchoolComponent,
    canActivate: [AuthGuard],
  },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "verify-email-address", component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
