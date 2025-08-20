import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe ,Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
