import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe ,Request, Get,Res, Redirect,Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from 'src/stategies/google.guard';

@Controller({
  path: 'auth',
  version:'1'
})
export class AuthController {
  constructor(private readonly authService: AuthService) {
    
    
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto:RegisterDto){
    await this.authService.createUser(dto)
    return { message:'Đăng kí thành công'}
  }

  @Get('google/login')
  @UseGuards(GoogleOauthGuard)
  async handleLogin() {
    return 
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async handleCallback(@Request() req,
                       @Response() res) {
    const token = await this.authService.login(req.user)
    console.log(token)
    const redirectURL = `http://localhost:5173/callback?accessToken=${token.accessToken}`
    res.redirect(redirectURL)
  }
  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    
    return this.authService.login(req.user)
  }
}
