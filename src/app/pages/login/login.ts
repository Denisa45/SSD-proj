import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';    // 👈 ADD THIS
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],   // 👈 ADD RouterLink HERE
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    EmailId: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', Validators.required)
  });

  route = inject(Router);
  userService = inject(UserService);

  onLogin() {
      const { EmailId, Password } = this.loginForm.value;
    const userData = { email: EmailId, password: Password };

    this.userService.login(EmailId, Password).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.route.navigate(['/dashboard']); // we'll fix this below 👇
      },
      error: (err) => console.error(err)
    });

  }
}
