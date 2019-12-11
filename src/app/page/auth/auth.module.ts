import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './containers/sign-in/sign-in.component';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { Routes, RouterModule } from '@angular/router';

const authRoutes: Routes = [
  { path: '', component: SignInComponent }
];


@NgModule({
  declarations: [SignInComponent, SignInFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRoutes)
  ]
})
export class AuthModule { }
