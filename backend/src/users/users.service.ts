import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type BcryptHash = {
  hash: (value: string, saltOrRounds: number | string) => Promise<string>;
};

const bcryptHash = (bcrypt as unknown as BcryptHash).hash;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): PrismaService & {
    user: {
      findMany: (...args: any[]) => Promise<unknown[]>;
      findUnique: (...args: any[]) => Promise<Record<string, any> | null>;
      create: (...args: any[]) => Promise<unknown>;
      update: (...args: any[]) => Promise<unknown>;
      delete: (...args: any[]) => Promise<unknown>;
    };
  } {
    return this.prisma as PrismaService & {
      user: {
        findMany: (...args: any[]) => Promise<unknown[]>;
        findUnique: (...args: any[]) => Promise<Record<string, any> | null>;
        create: (...args: any[]) => Promise<unknown>;
        update: (...args: any[]) => Promise<unknown>;
        delete: (...args: any[]) => Promise<unknown>;
      };
    };
  }

  getUsers() {
    return this.prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(user: CreateUserDto) {
    const hashedPassword = await bcryptHash(user.password, 10);

    return this.prismaClient.user.create({
      data: {
        name: user.name,
        email: user.email,
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

  async updateUser(id: number, user: UpdateUserDto) {
    await this.getUserById(id);

    return this.prismaClient.user.update({
      where: { id },
      data: user,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number) {
    await this.getUserById(id);

    return this.prismaClient.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
