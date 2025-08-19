import { Type } from "class-transformer"
import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength ,IsNumber} from "class-validator"

export class SearchAndFilterProduct{
        @IsString({message:'Tìm kiếm nên là chuỗi kí tự'})
        @IsOptional()
        searchQuery?: string
        
        @IsNumberString({},{message:'Trang nên là số'})
        @MinLength(1)
        @IsOptional()
        page?: string
        
        @IsNumberString({},{message:'Số trang giới hạn nên là số'})
        @IsOptional()
        limit?: string
        
        @IsString({message:'Sắp xếp theo nên là chuỗi kí tự'})
        @IsIn(['title', 'category', 'price', 'createdAt', 'updatedAt',''],{message:'Sắp xếp theo nên thuộc các cột sau: title,category,price,createdAt,updatedAt'})
        @IsOptional()
        sortBy?: string
        
        
        @IsString({message:'Thứ tự sắp xếp nên là chuỗi kí tự'})
        @IsIn(['asc', 'desc','default'],{message:'Thự tự săp xếp  : asc,desc,default'})
        @IsOptional()
        sortOrder?: string
        
        @IsString({message:'Loại sản phẩm nên là chuỗi kí tự'})
        @IsOptional()
        categoryFilter?: string

        @IsNumber({},{message:'Giá thấp nhât nên là số'})
        @IsOptional()
        @Type(()=>Number)
        minPrice?: number
        
        @IsNumber({},{message:'Giá cao nhất nên là số'})
        @IsOptional()
        @Type(()=>Number)
        maxPrice?:number
    
        
    
}