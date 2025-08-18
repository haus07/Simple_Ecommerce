import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/entities/role.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class RoleService implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>
    ) { }


    async onModuleInit() {
        const roles = ['user', 'admin']
        for (const role of roles) {
            const name = role
            const exist = await this.roleRepo.findOne({ where: { name: name } })
            if (!exist) {
                const role = this.roleRepo.create({ name: name })
                await this.roleRepo.save(role)
            }
        }
    }

    async findByName(keyword: string): Promise<Role | null> {
        const exist = await this.roleRepo.findOne({ where: { name: keyword } })
        return exist
    }

    async findRoles(rolesName: string[]): Promise<Role[]>{
        const roles = this.roleRepo.find({
            where: {name:In(rolesName)}
        })
        return roles
    }
}
