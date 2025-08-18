import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService:JwtService
    ) { }

    async createUser(dto: RegisterDto) {
        const isExistEmail = await this.userService.IsEmailExist(dto.email)
        if (isExistEmail) {
            throw new BadRequestException('Email nay da ton tai')
        }
        const isUsernameExist = await this.userService.IsUserNameExist(dto.username)
        if (isUsernameExist) {
            throw new BadRequestException('Username nay da ton tai')
        }
        return await this.userService.create(dto)
    }


    async validate(username:string,pass:string): Promise<any> {
        const user = await this.userService.findByName(username)
        if (!user) {
            throw new NotFoundException('Khong tim thay user')
        }
        const matched = await comparePassword(pass, user.password)
        if (!matched) {
            throw new UnauthorizedException('Username hoac ma khau khong dung')
        }
        const { password, ...result } = user
        return result
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id,
            roles: user.roles.map((r) => r.name)
        }
        const accessToken = await this.jwtService.signAsync(payload)
        return {accessToken:accessToken}
    }
}
