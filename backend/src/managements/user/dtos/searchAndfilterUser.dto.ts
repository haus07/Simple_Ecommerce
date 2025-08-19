import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator"
import { UserStatus } from "src/common/enums/user-status.enum"



export class SearchAndFilterUserDto{
    @IsString({message:'Tìm kiếm nên là chuỗi kí tự'})
    @IsOptional()
    searchQuery?: string
    
    @IsNumberString({},{message:'Số trang nên là số'})
    @MinLength(1)
    @IsOptional()
    page?: string
    
    @IsNumberString({},{message:'Số trang giới hạn nên là số'})
    @IsOptional()
    limit?: string
    
    @IsString()
    @IsIn(['username', 'email', 'phone', 'createdAt', 'updatedAt'],{message:'Sắp xếp theo nên là các cột sau: username,email,phone,createdAt,updatedAt'})
    @IsOptional()
    sortBy?: string
    
    
    @IsString({message:'Thứ tự sắp xếp nên là asc,desc'})
    @IsIn(['asc', 'desc'])
    @IsOptional()
    sortOrder?: string
    
    @IsEnum(UserStatus)
    statusFilter: UserStatus.ACTIVE

    
}