import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequest, DeleteUserRequest, DeleteUserResponse, GetUserByIdRequest, UpdateUserRequest, UserListResponse, UserResponse } from './user.pb';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    try {
      const user = this.repository.create({
        username: data.username,
        email: data.email,
        created_at: new Date(),
      });

      const saved = await this.repository.save(user);

      return { user: this.toUserDto(saved) };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user')
    }

  }

  // async getAllUsers(): Promise<UserListResponse> {
  //   const users = await this.repository.find();
  //   return {
  //     users: users.map((u) => this.toUserDto(u)),
  //   };
  // }

  async getUserById(data: GetUserByIdRequest): Promise<UserResponse> {
    const user = await this.repository.findOneBy({ id: +data.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user: this.toUserDto(user) };
  }

  async updateUser(data: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.repository.findOneBy({ id: +data.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = data.username ?? user.username;
    user.email = data.email ?? user.email;

    const updated = await this.repository.save(user);

    return { user: this.toUserDto(updated) };
  }

  async deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    const result = await this.repository.delete({ id: +data.id });

    return { success: result.affected! > 0 };
  }

  private toUserDto(user: User): UserResponse['user'] {
    return {
      id: String(user.id),
      username: user.username,
      email: user.email,
      createdAt: user.created_at.toISOString(),
    };
  }
}
