import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserService,User } from '../services/user.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  route = inject(Router);
  userService = inject(UserService);

  onRegister() {
    const { name, email, password } = this.registerForm.value;

    if (!name || !email || !password) {
      alert('⚠️ Please fill in all fields.');
      return;
    }
    const userData = { name, email, password };
    localStorage.setItem('user', JSON.stringify(userData));

    this.userService.register({ name, email, password }).subscribe({
  next: (newUser) => {
    // ✅ SAVE USER INFO HERE TOO
    localStorage.setItem('user', JSON.stringify(newUser));

    // optional: redirect to dashboard
    this.route.navigate(['/dashboard']);
  },
  error: (err) => {
    console.error('Register failed', err);
  }
});

  }
}
