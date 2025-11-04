import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ important for no module
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // needed for [formGroup] & [routerLink]
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const { name, email, password } = this.registerForm.value;
    const userData: User = { name, email, password };

    try {
      await this.authService.signup(email, password);
      this.userService.registerLocal(userData);
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Registration failed', err);
      alert(err.message || 'Registration failed.');
    }
  }
}
