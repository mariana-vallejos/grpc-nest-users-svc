import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequest,
  DeleteUserRequest,
  GenericResponse,
  GetUserByIdRequest,
  UpdateUserRequest,
  UserList,
} from './user.pb';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const user = this.repository.create({
        username: data.username,
        email: data.email,
        created_at: new Date(),
      });

      const saved = await this.repository.save(user);

      return saved;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getAllUsers(): Promise<GenericResponse> {
    try {
      const users = await this.repository.find();

      const userList: UserList = {
        users: users.map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          createdAt: u.created_at.toISOString(),
        })),
      };

      return {
        status: 200,
        userList,
      };

    } catch (err) {
      return {
        status: 500,
        error: 'Internal server error',
      };
    }
  }

  async getUserById(data: GetUserByIdRequest): Promise<GenericResponse> {
    try {
      const user = await this.repository.findOneBy({ id: data.id });

      if (!user) {
        return {
          status: 404,
          error: 'User not found',
        };
      }

      return {
        status: 200,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at.toISOString(),
        },
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return {
        status: 500,
        error: 'Internal server error',
      };
    }
  }


  // async updateUser(data: UpdateUserRequest): Promise<UserResponse> {
  //   const user = await this.repository.findOneBy({ id: +data.id });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   user.username = data.username ?? user.username;
  //   user.email = data.email ?? user.email;

  //   const updated = await this.repository.save(user);

  //   return { user: this.toUserDto(updated) };
  // }

  // async deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
  //   const result = await this.repository.delete({ id: +data.id });

  //   return { success: result.affected! > 0 };
  // }

  // private toUserDto(user: User): UserResponse['user'] {
  //   return {
  //     id: String(user.id),
  //     username: user.username,
  //     email: user.email,
  //     createdAt: user.created_at.toISOString(),
  //   };
  // }
}
