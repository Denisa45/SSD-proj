import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  // ✅ Registration
  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      username,
      password: hashedPassword,
    });

    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }

  // ✅ Login (with password)
  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new Error('User not found.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials.');

    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }

  // ✅ Google Login or Register
  async loginWithGoogle(email: string, name: string) {
    let user = await this.userService.findByEmail(email);

    // If user doesn't exist, create one automatically
    if (!user) {
      user = await this.userService.create({
        username: name,
        email,
        password: '', // optional placeholder
      });
    }

    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
