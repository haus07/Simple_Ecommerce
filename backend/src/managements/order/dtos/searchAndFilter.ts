
import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator"


export class SearchAndFilterOrder{
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
            @IsIn(['createdAt', 'totalPrice',  'updatedAt'])
            @IsOptional()
            sortBy?: string
            
            
            @IsString()
            @IsIn(['asc', 'desc'])
            @IsOptional()
            sortOrder?: string
            
            @IsString()
            @IsOptional()
            statusFilter?: string
}