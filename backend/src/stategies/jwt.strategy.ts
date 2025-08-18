import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,ExtractJwt} from "passport-jwt";
import { UserService } from "src/managements/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService:UserService) {
    
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:'hau123'
        })
    }

    async validate(payload: any) {
        const user = await this.userService.findByName(payload.username)

        if (!user) {
            throw new UnauthorizedException('Nguoi dung ko ton tai hoac bi vo hieu')
        }

        return {
            id: user.id,
            username: user.username,
            roles:user.roles?.map((r)=>r.name)
            
        }
    }


}