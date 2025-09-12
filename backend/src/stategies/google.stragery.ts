import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { ProviderLogin, User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { IsEmail } from 'class-validator';
import { UserService } from "src/managements/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly userService: UserService,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) {
        super({
            clientID: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            callbackURL: process.env.CALLBACK_URL!,
            scope:['profile','email']
        })
    }

    async validate(accessToken:string,refreshToken:string,profile:any,done:VerifyCallback) {
        const { id,name, emails, photos } = profile
        let user = await this.userService.findByGoogleId(id)
        
        if (!user) {
          user =   await this.userService.createGoogleUser({
                username: name.givenName,
                email: emails[0].value,
                googleId: id,
                provider:ProviderLogin.GOOGLE
            })
        } 

        
            
            
        
        done(null,user)
    }
}