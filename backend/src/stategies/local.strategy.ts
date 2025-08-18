import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/managements/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        })
    }

    async validate(username: string, password: string): Promise<any>{
        const user = await this.authService.validate(username, password)
        if (!user) {
            throw new UnauthorizedException('Ten dang nhap hoac mat khau khong dung')
        }
        return user
    }
}