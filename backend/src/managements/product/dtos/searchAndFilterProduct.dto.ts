import { Type } from "class-transformer"
import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength ,IsNumber} from "class-validator"

export class SearchAndFilterProduct{
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
        @IsIn(['title', 'category', 'price', 'createdAt', 'updatedAt',''])
        @IsOptional()
        sortBy?: string
        
        
        @IsString()
        @IsIn(['asc', 'desc','default'])
        @IsOptional()
        sortOrder?: string
        
        @IsString()
        @IsOptional()
        categoryFilter?: string

        @IsNumber()
        @IsOptional()
        @Type(()=>Number)
        minPrice?: number
        
        @IsNumber()
        @IsOptional()
        @Type(()=>Number)
        maxPrice?:number
    
        
    
}