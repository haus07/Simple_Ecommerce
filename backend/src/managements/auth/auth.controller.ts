import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe ,Request, Get,Res, Redirect,Response, UseInterceptors, NotFoundException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from 'src/stategies/google.guard';
import { RefreshTokenInterceptor } from 'src/pipe/refresh_toke.interceptor';

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
    const ip = req.ip
    const token = await this.authService.login(req.user,ip)
    console.log(token)
    const redirectURL = `http://localhost:5173/callback?accessToken=${token.accessToken}`
    res.redirect(redirectURL)
  }
  
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(RefreshTokenInterceptor)
  @Post('login')
  async login(@Request() req) {
    const ip = req.ip
    const data = await this.authService.login(req.user,ip)
    return {
      accessToken : data.accessToken
    }
  }

  @Post('refresh')
  @UseInterceptors(RefreshTokenInterceptor)
  async refresh(@Request() req) {
    const token = req.cookies['refresh_token']
    if (!token) {
      throw new NotFoundException('Không tìm thấy')
    }
    return await this.authService.refreshToken(token)
    
  }

}
