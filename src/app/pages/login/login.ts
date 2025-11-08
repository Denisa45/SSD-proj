import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private firebaseAuth: AuthService 
  ) {}

  onLogin() {
    if (this.loginForm.invalid) {
      alert('Please enter your username and password.');
      return;
    }

    const { username, password } = this.loginForm.value;

    this.api.login(username!, password!).subscribe({
      next: (res) => {
        // Save JWT token for authenticated requests
        localStorage.setItem('token', res.token);
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Login failed.');
      }
    });
  }

 async loginWithGoogle() {
  try {
    const user = await this.firebaseAuth.loginWithGoogle();

    // ✅ Send user to backend to sync
    const res = await fetch('http://localhost:3000/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, name: user.displayName })
    });

    const data = await res.json();
    localStorage.setItem('token', data.token);

    // ✅ Also store Firebase info for UI
    localStorage.setItem('user', JSON.stringify({ email: user.email, name: user.displayName }));

    this.router.navigate(['/dashboard']);
  } catch (err: any) {
    console.error(err.message);
    alert('Google login failed.');
  }
}




}
