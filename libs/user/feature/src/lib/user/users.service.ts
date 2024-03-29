import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPassword, Users } from '@j-irais-bruler-chez-vous/user/feature';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserTrash } from '../user-trash/user-trash.entity';
import { UserManifestation } from '../user-manifestation/user-manifestation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>,

    @InjectRepository(UserTrash)
    private readonly userTrashRepository: Repository<UserTrash>,

    @InjectRepository(UserManifestation)
    private readonly userManifestationRepository: Repository<UserManifestation>,

    @Inject('MAILING_SERVICE')
    private readonly mailingClient: ClientProxy
  ) {}

  /**
   * Get Specific User based on his ID
   *
   * @param id
   * @returns {Promise<User>} Found user
   */
  async findOne(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: [
        'id',
        'username',
        'email',
        'roles',
        'userTrash',
        'userManifestation',
        'forgotPassword',
      ],
      relations: ['userManifestation'],
    });

    return user;
  }

  /**
   * Get a specific user by Email
   *
   * @param email
   * @returns {Promise<User | undefined>} Found User, or undefined if user doesn't exists
   */
  async findByEmail(email: string): Promise<Users | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: [
        'id',
        'username',
        'email',
        'roles',
        'userTrash',
        'userManifestation',
        'forgotPassword',
      ],
    });

    return user;
  }

  /**
   * Get a specific user by either his email or username
   *
   * @param {string} identifier Email or Username
   * @returns {Promise<User | undefined>} Found User, or undefined if user doesn't exists
   */
  async findByIdentifier(
    identifier: string,
    root?: boolean
  ): Promise<Users | undefined> {
    let user;
    if (!root) {
      user = await this.userRepository.findOne({
        where: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        select: [
          'id',
          'username',
          'email',
          'roles',
          'userTrash',
          'userManifestation',
          'forgotPassword',
        ],
      });
    } else {
      user = await this.userRepository.findOne({
        where: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });
    }

    return user;
  }

  /**
   * Find all users
   *
   * @returns {Promise[User]} All users
   */
  async findAll(): Promise<Users[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'roles',
        'userTrash',
        'userManifestation',
        'forgotPassword',
      ],
    });
  }

  /**
   * Creates User
   *
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<User>} Promise User Created
   */
  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const user = new Users();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save(user);
  }

  /**
   * Update User
   *
   * @param {number} id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<Users>} Promise User Updated
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    user.username = updateUserDto.username;
    return await this.userRepository.save(user);
  }

  /**
   * Deletes User
   *
   * @param {number} id
   * @returns {Promise<User>} Promise User Deleted
   */
  async deleteUser(id: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.remove(user);
  }

  /**
   * Verify that user can make request because he is the owner of the entity
   *
   * @param {string} currentUserNickname
   * @param {string} requestedUserId
   *
   * @returns {Promise<boolean>}
   */
  async checkOwner(
    currentUserNickname: string,
    requestedUserId: string
  ): Promise<boolean> {
    const currentUser = await this.findByIdentifier(currentUserNickname);
    const requestedUser = await this.findOne(requestedUserId);

    return currentUser === requestedUser;
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);

      if (!user) throw new NotFoundException('User not found');

      const forgotPassword = new ForgotPassword();
      forgotPassword.user = user;

      await this.userRepository.manager.save(forgotPassword);

      this.mailingClient.emit('sendMail', {
        to: user.email,
        subject: '[JBCV] Votre lien de réinitialisation de mot de passe',
        text: `${process.env.FRONT_URL}/forgot-password/${forgotPassword.id}`,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async forgotPasswordToken(id: string, password: string): Promise<boolean> {
    try {
      //find entity with the user relation
      const forgotPassword = await this.forgotPasswordRepository.findOne({
        where: {
          id: id,
        },
        relations: ['user'],
      });

      if (!forgotPassword)
        throw new NotFoundException('Forgot password not found');

      const user = forgotPassword.user;
      user.password = await bcrypt.hash(password, 10);

      await this.userRepository.save(user);
      await this.forgotPasswordRepository.remove(forgotPassword);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addTrashToUser(userId: string, trashId: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userTrash'],
    });

    const userTrash = new UserTrash();
    userTrash.user = user;
    userTrash.trashId = trashId;

    await this.userTrashRepository.save(userTrash);

    return user;
  }

  async removeTrashFromUser(userId: string, trashId: string): Promise<Users> {
    const userTrash = await this.userTrashRepository.findOne({
      where: {
        userId: userId,
        trashId: trashId,
      },
    });

    await this.userTrashRepository.remove(userTrash);

    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userTrash'],
    });
  }

  async addManifestationToUser(
    userId: string,
    manifestationId: string
  ): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userManifestation'],
    });

    const userManifestation = new UserManifestation();
    userManifestation.user = user;
    userManifestation.manifestationId = manifestationId;

    await this.userManifestationRepository.save(userManifestation);

    return user;
  }

  async removeManifestationFromUser(
    userId: string,
    manifestationId: string
  ): Promise<Users> {
    const userManifestation = await this.userManifestationRepository.findOne({
      where: {
        userId: userId,
        manifestationId: manifestationId,
      },
    });

    await this.userManifestationRepository.remove(userManifestation);

    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userManifestation'],
    });
  }
}
