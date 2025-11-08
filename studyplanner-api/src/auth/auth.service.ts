import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwt:JwtService,
    ){}

    async register(username:string , password:string){
        const existing= await this.userService.findByUsername(username);
        if(existing) throw new BadRequestException('Username already registered');

        const user = await this.userService.createUser(username,password);
        return { message: 'User registered successfully', user };
    }

    async login(username:string , password:string){
        const user = await this.userService.findByUsername(username);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwt.signAsync({ id: user.id, username: user.username });
    return { token };
    }

        async loginOrRegisterGoogle(email: string, name?: string) {
    // Try to find user by email
    let user = await this.userService.findByUsername(email);

    // If not found, create a new one
    if (!user) {
        user = await this.userService.createUser(email, ''); // empty password
    }

    // Generate a JWT token
    const token = await this.jwt.signAsync({ id: user.id, username: user.username });
    return { token, message: 'Google user authenticated successfully' };
    }

}
