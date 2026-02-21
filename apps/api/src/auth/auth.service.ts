import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name ?? undefined,
      password: dto.password,
    });
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { success: true, data: { user: this.sanitizeUser(user), accessToken: token } };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { success: true, data: { user: this.sanitizeUser(user), accessToken: token } };
  }

  async getSession(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return { success: true, data: { user: this.sanitizeUser(user) } };
  }

  private sanitizeUser(user: { id: string; email: string; name: string | null; avatar: string | null; role: string }) {
    return { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role };
  }
}
