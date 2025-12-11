import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ standalone component
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      // ✅ Validators must be passed as an *array* if multiple
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      alert('Please fill all fields correctly');
      return;
    }

    const { username, password } = this.registerForm.value;

    this.api.register(username, password).subscribe({
      next: (res) => {
        alert('Registered successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed');
      }
    });
  }
}
