import { ChatService } from './login.service';
import { log } from 'console';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({});

  constructor(private authService: ChatService, private _FormBuilder: FormBuilder , private _router : Router) {

    this.loginForm = this._FormBuilder.group({ username: '', password: '' });
  }

  loginWithGoogle() : void {
    // this.authService.signInWithGoogle();
  }

  login(): void {
       console.log('loginWithGoogle');
    const param = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.authService.Login(param).subscribe((res: any) => {
      localStorage.setItem('token', res.token);
      this._router.navigate(['/chat']);
    });

  }




}
