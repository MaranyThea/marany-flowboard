import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const bcryptService = bcrypt as unknown as {
  hash: (value: string, saltRounds: number) => Promise<string>;

  compare: (value: string, encrypted: string) => Promise<boolean>;
};

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================================================
  // EMAIL / PASSWORD REGISTER
  // =========================================================

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcryptService.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // =========================================================
  // EMAIL / PASSWORD LOGIN
  // =========================================================

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcryptService.compare(
      data.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createLoginResponse(user.id, user.name, user.email);
  }

  // =========================================================
  // GOOGLE REGISTER
  // =========================================================

  async googleRegister(data: GoogleLoginDto) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: data.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google account');
      }

      const googleId = payload.sub;
      const email = payload.email;

      if (!googleId || !email) {
        throw new UnauthorizedException(
          'Google account information is incomplete',
        );
      }

      // Check whether an Apex account already exists.
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(
          'An account with this Google email already exists. Please sign in instead.',
        );
      }

      const name =
        (payload.name ??
          [payload.given_name, payload.family_name]
            .filter(Boolean)
            .join(' ')) ||
        email.split('@')[0];

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: '',
        },
      });

      return this.createLoginResponse(user.id, user.name, user.email);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Google registration failed:', error);

      throw new UnauthorizedException('Google registration failed');
    }
  }

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  async googleLogin(data: GoogleLoginDto) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: data.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google account');
      }

      const email = payload.email;

      if (!email) {
        throw new UnauthorizedException('Google account email is missing');
      }

      // Google account must already be registered
      // with Apex.
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException(
          'No Apex account exists with this Google account. Please register first.',
        );
      }

      return this.createLoginResponse(user.id, user.name, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Google login failed:', error);

      throw new UnauthorizedException('Google login failed');
    }
  }

  // =========================================================
  // CREATE APEX JWT
  // =========================================================

  async getGoogleProfile(data: GoogleLoginDto) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: data.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google account');
      }

      if (!payload.email) {
        throw new UnauthorizedException('Google account email is missing');
      }

      return {
        firstName: payload.given_name ?? '',
        lastName: payload.family_name ?? '',
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Google profile verification failed:', error);

      throw new UnauthorizedException('Unable to verify Google account');
    }
  }

  private async createLoginResponse(
    userId: number,
    name: string,
    email: string,
  ) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,

      user: {
        id: userId,
        name,
        email,
      },
    };
  }
}
