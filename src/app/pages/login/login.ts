import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    EmailId: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', Validators.required)
  });

  private route = inject(Router);
  private authService = inject(AuthService);

  // Firebase email/password login
  async loginWithEmail() {
    const { EmailId, Password } = this.loginForm.value;
    try {
      const user: FirebaseUser = await this.authService.loginWithEmail(EmailId, Password);
      localStorage.setItem('user', JSON.stringify({ email: user.email, uid: user.uid }));
      this.route.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  }

  // Firebase Google login
  async loginWithGoogle() {
  try {
    const user = await this.authService.loginWithGoogle();
    localStorage.setItem('user', JSON.stringify({ email: user.email, uid: user.uid }));
    this.route.navigate(['/dashboard']);
  } catch (err: any) {
    console.error(err.message);
  }
}

}
