import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit {

  signInForm: FormGroup;
  shwErr = '';
  get email() { return this.signInForm.get('email') };
  get password() { return this.signInForm.get('password') };

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.signInForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8)]
      ]
    })
  }

  ngOnInit() {
  }

  signIn() {
    if (this.signInForm.valid) {
      this.shwErr = '';
      let { email, password } = this.signInForm.getRawValue()
      let login = this.authService.login(email, password).toPromise();
      login.then(res => {
        if (res.success) {
          this.router.navigate(['dashboard']);
        } else {
          this.shwErr = res.err;
        }
      })
    } else {
      console.error('Not Valid')
    }
  }

}
