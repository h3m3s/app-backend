import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { create } from "domain";
import { user } from "src/entities/user.entity";
import { Repository } from "typeorm";
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(user) 
        private userRepository:  Repository<user>,
    ){}


    getAllUsers(): Promise<user[]> {
        return this.userRepository.find();
    }

    async isUserExist(data: {email: string}): Promise<user | null> {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: data.email,
            }
        });
        return foundUser;
    }

    async createUser(data: {
        email: string;
        password: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: number;
    }): Promise<user> {
        // Check if user already exists
        const existingUser = await this.isUserExist({ email: data.email });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create new user
        const newUser = this.userRepository.create({
            email: data.email,
            password: hashedPassword,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            isPermitted: false, // New users are not permitted by default
        });

        return this.userRepository.save(newUser);
    }
  }
