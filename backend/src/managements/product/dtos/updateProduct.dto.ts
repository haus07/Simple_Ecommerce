import { IsNumber, IsOptional, IsString, MaxLength, MinLength ,Min, Max, IsInt} from "class-validator"

export class UpdateProduct{


    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    title?: string
    
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsOptional()
    brand?: string
    
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsOptional()
    category?: string
    
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    descripition?: string
    
 
    
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number
    
    @IsNumber()
    @Min(1)
    @IsOptional()
    price?: number
    

}