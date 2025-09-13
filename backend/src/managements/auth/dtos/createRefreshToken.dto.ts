import { IsNumber, IsOptional, IsString } from "class-validator";

export class RefreshTokenDto{
    @IsNumber()
    userId: number
    
   
    
    @IsOptional()
    @IsString()
    ip_address?:string
}