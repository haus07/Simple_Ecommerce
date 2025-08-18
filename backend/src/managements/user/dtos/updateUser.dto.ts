import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
 
export class UpdateUserDto{

    
   @IsString({ message: 'Email phải là chuỗi không phải hình đặc biệt' })
    @IsNotEmpty({ message: 'Email không được để trống' })
   @IsEmail()
    @IsOptional()
    email?: string

  @IsString({ message: 'Số điện thoại phải là chuỗi không phải hình đặc biệt' })
    @IsPhoneNumber('VN',{message:'Số điện thoại phải theo định dạng Việt Nam'})
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
      @IsOptional()
    phone?: string
}