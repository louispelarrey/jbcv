import { CreateUserDto } from '@j-irais-bruler-chez-vous/user/feature';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER') private readonly userClient: ClientProxy,
  ){}

  findAll() {
    return this.userClient.send('findAll', {});
  }

  createUser(createUserDto: CreateUserDto) {
    return this.userClient.send('createUser', createUserDto);
  }

  findOne(id: string) {
    return this.userClient.send('findOne', id);
  }

  updateUser(id: string, updateUserDto: CreateUserDto) {
    return this.userClient.send('updateUser', { id, updateUserDto });
  }

  deleteUser(id: string) {
    return this.userClient.send('deleteUser', id);
  }
}
