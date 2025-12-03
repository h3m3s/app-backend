import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { user } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
  ) {}
  async register(dto: RegisterDto): Promise<Omit<user, 'password'>> {
    const existingByEmail = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingByEmail) {
      throw new BadRequestException('Email już jest w użyciu');
    }
    const existingByUsername = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existingByUsername) {
      throw new BadRequestException('Nazwa użytkownika jest już w użyciu');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const entity = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
      isPermitted: false,
    });
    const saved = await this.userRepository.save(entity);
    const { password, ...rest } = saved as any;
    return rest;
  }
  async login(dto: LoginDto): Promise<Omit<user, 'password'>> {
    const where = dto.usernameOrEmail.includes('@')
      ? { email: dto.usernameOrEmail }
      : { username: dto.usernameOrEmail };
    const found = await this.userRepository.findOne({ where });
    if (!found) {
      throw new BadRequestException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, found.password);
    if (!ok) {
      throw new BadRequestException('Invalid credentials');
    }
    const { password, ...rest } = found as any;
    return rest;
  }

  async findById(id: number): Promise<Omit<user, 'password'>> {
    const found = await this.userRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException('User not found');
    }
    const { password, ...rest } = found as any;
    return rest;
  }

  async findAll(): Promise<Omit<user, 'password'>[]> {
    const list = await this.userRepository.find();
    return list.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
  }
}
