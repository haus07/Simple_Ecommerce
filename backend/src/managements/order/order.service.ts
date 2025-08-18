import { Injectable, Controller, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/entities/order-items.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateOrderDto } from './dtos/update.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginateResult } from './interface/PaginateResult';
import { SearchAndFilterOrder } from './dtos/searchAndFilter';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class OrderService {

    constructor(@InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
        @InjectRepository(OrderItems)
        private readonly orderItemsRepo: Repository<OrderItems>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepo:Repository<Product>) { }



    async getOrderByOrderCode(orderCode:string) {
        const order = this.orderRepo.findOne({
            where:{orderCode}
        })
        if (!order) {
            throw new NotFoundException('Không tìm thấy đơn hàng o service')
        }
        return order
    }
    
    async createOrder(userId: number, orderItems: CheckoutDto) {
        const user = await this.userRepo.findOne({
            where: {
                id:userId
            }
        })
        if (!user) {
            throw new NotFoundException("Không tìm thấy người dùng")
        }
        let order = await this.orderRepo.create({
            user: user
        })
        order =  await this.orderRepo.save(order)

        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        order.orderCode = `OD-${datePart}-${order.id.toString().padStart(6, '0')}`
        

        const orderItemsEntities = await Promise.all(
            orderItems.items.map(async (item) => {
                const product = await this.productRepo.findOneBy({ id: item.productId })
                if (!product) {
                    throw new NotFoundException("Không tìm thấy sản phẩm")
                }
                return this.orderItemsRepo.create({
                    product,
                    quantity:item.quantity
                })
            })
        )
        order.items = orderItemsEntities
        order.totalPrice  = orderItemsEntities.reduce((sum,item)=>sum+Number(item.product.price)*item.quantity,0)
         

        await this.orderRepo.save(order)
        return {
            success: true,
            orderId:order.id
        }


    }

    async getOrderById(id:number) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations:['items.product']
        })
        if (!order) {
            throw new NotFoundException('Khong tim thay don hang')
        }
        return order
    }

        async updateOrder(id:number,update:UpdateOrderDto) {
            const order = await this.orderRepo.findOne({
                where: { id },
                relations:['items.product']
            })

            if (!order) {
                throw new NotFoundException('Khong tim thay don hang')
            }

            order.status = update.status
            const newOrder = await this.orderRepo.save(order)
            return {
                success: true,
                order:newOrder
            }
    }
    
    async getAllOrder(query:SearchAndFilterOrder) :Promise<PaginateResult<Order>|undefined>{
        try {
            const { searchQuery,sortOrder,sortBy} = query
            const page = Number(query.page) || 1
            const limit = Number(query.limit) || 10
            const statusFilter = query.statusFilter||'all'
            const skip = (page - 1) * limit

            const queryBuilder = this.orderRepo.createQueryBuilder('order')
            queryBuilder.leftJoinAndSelect('order.user', 'user')
            
            if (statusFilter && statusFilter !== 'all') {
                queryBuilder.where('order.status = :status', {status:statusFilter})
            }

            if (searchQuery) {
                const searchCondition = `(LOWER(user.username) LIKE LOWER(:searchQuery))`

                if (statusFilter && statusFilter !== 'all') {
                    queryBuilder.andWhere(searchCondition, { searchQuery: `${searchQuery}` })
                } else {
                    queryBuilder.where(searchCondition, { searchQuery:`${searchQuery}`})
                }
            }

            if (sortBy && sortOrder) {
                queryBuilder.orderBy(`order.${sortBy}`,sortOrder.toUpperCase() as 'DESC'||'ASC')
            } else {
                queryBuilder.orderBy(`order.orderDate`,`DESC`)
            }

            queryBuilder.skip(skip).take(limit)

            const [data, total] = await queryBuilder.getManyAndCount()
            const totalPages = Math.ceil(total/limit)
            return {
                data,total,page,limit,totalPages
            }
        } catch (error) {
             // Ghi lại lỗi để tiện debug
        console.error('Lỗi khi lấy đơn hàng:', error.message);
        
        // Ném ra một HttpException để NestJS xử lý
        throw new HttpException(
            'Không thể lấy danh sách đơn hàng.', 
            HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOrderByUserId(userId,query:SearchAndFilterOrder):Promise<PaginateResult<Order>> {
        try {
            const { searchQuery, sortOrder, sortBy, statusFilter } = query
            const page = Number(query.page) || 1
            const limit = Number(query.limit) || 5
            const skip = (page - 1) * limit
            const queryBuilder = this.orderRepo.createQueryBuilder('order')
            queryBuilder.leftJoinAndSelect('order.items', 'items')
            queryBuilder.leftJoinAndSelect('items.product', 'product')
            queryBuilder.where('order.user.id = :userId', { userId })
            
            if (statusFilter && statusFilter !== 'all') {
                queryBuilder.andWhere('order.status =:statusFilter', {statusFilter})
            }

            if (sortBy && sortOrder) {
                queryBuilder.orderBy(`order.${sortBy}`,sortOrder.toUpperCase() as 'DESC' || 'ASC')
            } else {
                queryBuilder.orderBy('order.createdAt','DESC')
            }

            queryBuilder.skip(skip).take(limit)

            const [data, total] = await queryBuilder.getManyAndCount()
            const totalPages = Math.ceil(total/limit)
            return {
            data,total,page,limit,totalPages
        }
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error.message);
        
        // Ném ra một HttpException để NestJS xử lý
        throw new HttpException(
            'Không thể lấy danh sách đơn hàng.', 
            HttpStatus.INTERNAL_SERVER_ERROR)
       }
    } 
    
}
