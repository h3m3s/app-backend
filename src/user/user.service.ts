import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { create } from "domain";
import { user } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(user) 
        private userRepository:  Repository<user>,
    ){}


    getAllUsers(): Promise<user[]> {
        return this.userRepository.find();
    }

    async loginUser(data: {email: string, password: string}): Promise<user | string> {
        const passwordSha1 = createHash('sha1').update(data.password).digest('hex');

        const foundUser = await this.userRepository.findOne({
            select: {
                id: true,
                username: true,
            },
            where: {
                email: data.email,
                password: passwordSha1,
            }
        });

        return foundUser || "User not found";
    }
  }