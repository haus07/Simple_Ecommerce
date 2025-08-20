import { Controller, UnauthorizedException,Get,Request, UseGuards ,Param,ParseIntPipe,Patch, NotFoundException, Body, Post, BadRequestException, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/stategies/roles.guard';
import { Roles } from 'src/utils/decoretors/role.decorator';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { AdminRegisterDto } from './dtos/AdminRegister.dto';
import { SearchAndFilterUserDto } from './dtos/searchAndfilterUser.dto';


@Controller({
  path: 'users',
  version:'1'
})
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    const username = req.user?.username
    const user = await this.userService.findByName(username)
    if (!user) {
      throw new UnauthorizedException('Nguoi dung khong ton tai')
    }
    const { password, ...userWithoutPassword } = user
    return {
      userWithoutPassword
    }
  }

  //------------------@@@@@@@@@@@@----------------------------------------
  // co them @Role('admin') nua em chua lam 
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
  @Get('')
  async getAll(@Query() query:SearchAndFilterUserDto) {
    return await this.userService.findAll(query)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
 @Patch('soft-delete/:id')
async softDeleteUser(@Param('id', ParseIntPipe) id: number) {
  const success = await this.userService.softDelete(id);
  if (!success) throw new NotFoundException('User not found');
  return { message: 'User deactivated successfully' };
  }
  

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','user')
  @Patch(':id')
  async editUser(@Param('id',ParseIntPipe) id: number,
    @Body() body: UpdateUserDto) {
    console.log(body)
    if (body.email !== undefined) {
      const isEmailExist = await this.userService.IsEmailExist(body.email)
      if (isEmailExist) {
        throw new BadRequestException("Email dã tồn tại")
      }
    }
    return this.userService.updateUser(id,body)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('')
  async adminCreate(@Body() dto:AdminRegisterDto) {
    try {
      
      const isUsernameExist = await this.userService.IsUserNameExist(dto.username)
      if (isUsernameExist) {
        throw new BadRequestException('Tên đăng nhập đã tồn tại')
      }
      
      const isEmailExist = await this.userService.IsEmailExist(dto.email)
      if (isEmailExist) {
        throw new BadRequestException('Email đã tồn tại')
      }
      
      return await this.userService.adminCreate(dto)
    }catch(error){
            if (error.code === '23505') {
            throw new BadRequestException("Tên đăng nhập hoặc email đã tồn tại")
            }
            throw error
       }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('me/:id')
  async getInfo(@Param('id',ParseIntPipe) id: number) {
    return await this.userService.findById(id)
  }
}
