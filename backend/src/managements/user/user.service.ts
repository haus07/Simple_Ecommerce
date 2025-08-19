import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dtos/register.dto';
import { RoleService } from './../role/role.service';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { IsEmail } from 'class-validator';
import { hashPassword } from 'src/utils/bcrypt';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { AdminRegisterDto } from './dtos/AdminRegister.dto';
import { Cart } from 'src/entities/cart.entity';
import { PaginateResult } from '../order/interface/PaginateResult';
import { HttpException,HttpStatus} from '@nestjs/common';
import { SearchAndFilterUserDto } from './dtos/searchAndfilterUser.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User)
        private userRespo: Repository<User>,
        private roleRepo: RoleService,
        @InjectRepository(Cart)
        private cartRepo:Repository<Cart>
    ) { }
    

   async create(data:RegisterDto) {
        const role = await this.roleRepo.findByName('user')
        if (!role) {
                throw new NotFoundException("Không có vai trò này")
            }
        const hash = await  hashPassword(data.password)    
       const dataSave = await this.userRespo.create({ ...data, password: hash, roles: [role] })
        await this.userRespo.save(dataSave)
       const cart = await this.cartRepo.create({ user: dataSave })
       await this.cartRepo.save(cart)
       return {message:"Đăng kí thành công"}

    }

    async adminCreate(data: AdminRegisterDto) {
        const roles= await this.roleRepo.findRoles(data.roles)
        const rolesName = roles?.map(role => role.name)??[]
        if (rolesName.length !== data.roles.length) {
            throw new NotFoundException('Khong tìm thấy vai trò tương ứng')
        }
        const hash = await hashPassword(data.password)
        const dataSave = await this.userRespo.create({
            username: data.username,
            password: hash,
            email: data.email,
            phone: data.phone,
            roles:roles
            
        })
        const cart = await this.cartRepo.create({
            user: dataSave
        })
        await this.cartRepo.save(cart)

        return await this.userRespo.save(dataSave)
    }

    async IsEmailExist(keyword: string) {
        const exist = await this.userRespo.findOne({where:{email:keyword}})
        return !!exist
    }

    async IsUserNameExist(keyword: string) {
        const exist = await this.userRespo.findOne({where:{username:keyword}})
        return !!exist

    }

    async findByName(keyword: string): Promise<User | null>{
        const user = await this.userRespo.findOne({
            where: { username: keyword },
            relations:['roles']})
        return user
    }

    async findAll(query:SearchAndFilterUserDto) :Promise<PaginateResult<User>|null>{ 
        try {
            const status = query.statusFilter || UserStatus.ACTIVE
            const { searchQuery, sortOrder, sortBy } = query
            const page = Number(query.page) || 1
            const limit = Number(query.limit)|| 10
            const skip = (page - 1) * limit
            const queryBuilder = this.userRespo.createQueryBuilder('user')
            queryBuilder.where(`user.status = :status`,{status})

            if (searchQuery) {
            queryBuilder.where(
                '(LOWER(user.username) LIKE LOWER(:searchQuery))',
                { searchQuery: `%${searchQuery}%` }
            );
        }

            if (sortBy && sortOrder) {
                queryBuilder.orderBy(`user.${sortBy}`,sortOrder.toUpperCase() as 'DESC'|'ASC')
            } else {
                queryBuilder.orderBy(`user.id`,'ASC')
            }
            queryBuilder.skip(skip).take(limit)
            const [data, total] = await queryBuilder.getManyAndCount()
            
            return {
                data,total,page,limit,totalPages:Math.ceil(total/limit)
            }
        } catch (error){
             console.error('Lỗi khi lấy dữ liệu người dùng:', error.message);
                    
                    // Ném ra một HttpException để NestJS xử lý
                    throw new HttpException(
                        'Không thể lấy danh sách người dùng.', 
                        HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

    async softDelete(id:number):Promise<boolean> {
          const result = await this.userRespo.update({ id: id }, {
            status:UserStatus.DEACTIVATED
         })
        
          return result.affected === 1;
    }

    async updateUser(id: number, data: Partial<User>) {
        const user = await this.userRespo.findOneBy({ id })
        if (!user) throw new NotFoundException('Không tìm thấy người dùng')
        
        Object.assign(user, data)
        return await this.userRespo.save(user)
    }

    async findById(id: number) :Promise<User|null>{
        const user = await this.userRespo.findOneBy({ id })
        return user
    }
}
