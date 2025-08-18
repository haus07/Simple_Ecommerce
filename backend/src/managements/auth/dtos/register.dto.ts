import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
 
export class RegisterDto {
    @IsString({ message: 'Tên đăng nhập phải là kí không phải hình đặc biệt' })
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    @MinLength(3, { message: 'Tên đăng nhập phải ít nhất có 3 kí tự' })
    @MaxLength(20, { message: 'Tên đăng nhập chỉ được tối đa 20 kí tự' })
    username: string
    
    @IsString({ message: 'Mật khẩu phải là chuỗi không phải hình đặc biệt ' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string
    
    @IsString({ message: 'Email phải là chuỗi không phải hình đặc biệt' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail()
    email: string

    @IsString({ message: 'Số điện thoại phải là chuỗi không phải hình đặc biệt' })
    @IsPhoneNumber('VN',{message:'Số điện thoại phải theo định dạng Việt Nam'})
    @IsNotEmpty({message:'Số điện thoại không được để trống'})
    phone: string
}