import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator"
import { UserStatus } from "src/common/enums/user-status.enum"



export class SearchAndFilterUserDto{
    @IsString()
    @IsOptional()
    searchQuery?: string
    
    @IsNumberString()
    @MinLength(1)
    @IsOptional()
    page?: string
    
    @IsNumberString()
    @IsOptional()
    limit?: string
    
    @IsString()
    @IsIn(['username', 'email', 'phone', 'createdAt', 'updatedAt'])
    @IsOptional()
    sortBy?: string
    
    
    @IsString()
    @IsIn(['asc', 'desc'])
    @IsOptional()
    sortOrder?: string
    
    @IsEnum(UserStatus)
    statusFilter: UserStatus.ACTIVE

    
}