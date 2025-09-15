import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'
import { RefreshTokenDto } from './dtos/createRefreshToken.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepo:Repository<RefreshToken>
    ) { }

    async createUser(dto: RegisterDto) {
         const isExistEmail = await this.userService.IsEmailExist(dto.email)
        if (isExistEmail) {
            throw new BadRequestException('Email đã tồn tại vui lòng nhập lại')
        }
        const isUsernameExist = await this.userService.IsUserNameExist(dto.username)
        if (isUsernameExist) {
            throw new BadRequestException('Tên đăng nhập đã được sử dụng')
        }
        try {
            return await this.userService.create(dto)
           
       }catch(error){
            if (error.code === '23505') {
            throw new BadRequestException("Tên đăng nhập hoặc email đã tồn tại")
            }
            throw error
       }
    }


    async validate(username:string,pass:string): Promise<any> {
        const user = await this.userService.findByName(username)
        if (!user) {
            throw new NotFoundException('Tên đăng nhập hoặc mật khẩu không đúng')
        }
        const matched = await comparePassword(pass, user.password)
        if (!matched) {
            throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng')
        }
        const { password, ...result } = user
        return result
    }

    async login(user: any,ip:any) {
        console.log(user)
        const payload = {
            username: user.username,
            sub: user.id,
            roles: user?.roles.map((r) => r.name)
        }
        

        // truyền dữ liệu theo dto của refreshToken
        const data = {
            userId: user.id,
            ip_address:ip
        }

        const refreshToken = await this.createRefreshToken(data)
        

        const accessToken = await this.jwtService.signAsync(payload)
        
        return {
            accessToken,
            refreshToken
        }
    }



    
    //phương thức check token
    //nếu refresh Token còn hạn thi trả mới jwt
    //Nếu không thì tạo mới refresh Token xong update bắt người dùng đăng nhập lạo
   

    
    hashToken(token: string): string{
        return crypto.createHash('sha256').update(token).digest('hex')
    }

    generateToken():string {
        return crypto.randomBytes(32).toString('hex')
    }

    async createRefreshToken(data:RefreshTokenDto): Promise<string> {
        
        //Tạo token bằng crypto
        const rawRefreshToken = this.generateToken()
        // chỉ Lưu refreshToken dưới dạng hash trong db
        const hashToken = this.hashToken(rawRefreshToken)

        const user = await this.userService.findById(data.userId)
        if (!user) {
            throw new NotFoundException("Người dùng không tồn tại")
        }

        const refreshTokenData = await this.refreshTokenRepo.create({
            token_hash: hashToken,
            user,
            ip_address: data.ip_address,
            expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            created_at: new Date()
        })
        await this.refreshTokenRepo.save(refreshTokenData)
        return rawRefreshToken
    }


     async refreshToken(token:any):Promise<any> {
        const hashToken = this.hashToken(token)
        const existingToken = await this.refreshTokenRepo.findOne({
            where: {
                token_hash:hashToken
            },
            relations:['user','user.roles']
        })
        if (!existingToken) {
            throw new UnauthorizedException("Hết hạn truy cập")
        }
        const now = Date.now()
         const expireDate = existingToken.expired_at.getTime()
         // logic khi refresh token het han
         let rawToken
         if (expireDate < now) {
            await this.refreshTokenRepo.remove(existingToken)
            throw new UnauthorizedException("Hết phiên đăng nhâp")
        }
        const userName = existingToken.user.username
        const sub = existingToken.user.id
        const roles = existingToken.user.roles.map(role=>role.name)
        const payload = {
            username: userName,
            sub,
            roles
        }
        const accessToken = await this.jwtService.signAsync(payload)
         return {
            accessToken
        }
    }


    //update refresh token neu nhu refresh token het han
   

    
}
