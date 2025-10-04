import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {SessionService} from '../../services/session.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private sessionService = inject(SessionService);
  private router = inject(Router);
  private alertsService = inject(AlertService);
  //private spinner = inject(NgxSpinnerService);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const data = this.loginForm.value;

    this.sessionService.adminsLogin(data).subscribe({
      next: res => {
        const token = res.token;
        const profile = res.user;
        sessionStorage.setItem(this.sessionService.jwtToken, token);
        sessionStorage.setItem(this.sessionService.profileToken, btoa(JSON.stringify(profile)));
        this.router.navigate(['dashboard']);
        //this.spinner.hide();
      },
      error: err => {
        this.alertsService.error(err.error.errors);
      }
    })

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
