import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!requiredRoles || requiredRoles.length === 0) return true
        
        const { user } = context.switchToHttp().getRequest()

        if (!user || !user.roles) {
            throw new ForbiddenException('Khong co quyen truy ')
        }

        const userRoles = user.roles
        console.log(userRoles)
        const hasRole = userRoles.some((r:string)=>requiredRoles.includes(r))
        if (!hasRole) throw new ForbiddenException('Khong co quyen truy cap')
        return true
    }
}