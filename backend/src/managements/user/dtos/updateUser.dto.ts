import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { UserStatus } from 'src/common/enums/user-status.enum'
 
export class UpdateUserDto{

    
   @IsString({ message: 'Email phải là chuỗi không phải hình đặc biệt' })
   @IsEmail()
    @IsOptional()
    email?: string

  @IsString({ message: 'Số điện thoại phải là chuỗi không phải hình đặc biệt' })
    @IsPhoneNumber('VN',{message:'Số điện thoại phải theo định dạng Việt Nam'})
      @IsOptional()
  phone?: string
  
  @IsEnum(UserStatus)
  status:UserStatus
}