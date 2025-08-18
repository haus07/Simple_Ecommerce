import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { postgresDataSource } from 'src/typeorm/appDataSource';
import { Repository } from 'typeorm';
import { UpdateProduct } from './dtos/updateProduct.dto';
import { timeStamp } from 'console';
import { SearchAndFilterProduct } from './dtos/searchAndFilterProduct.dto';
import { PaginateResult } from '../order/interface/PaginateResult';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product)
                private readonly productRepo:Repository<Product>) { }
    
    async getAllProduct(query:SearchAndFilterProduct):Promise<PaginateResult<Product>|null> {
        const categoryFilter = query.categoryFilter
        const minPrice = query.minPrice? Number(query.minPrice):undefined
        const maxPrice = query.maxPrice? Number(query.maxPrice):undefined
        const { searchQuery, sortOrder, sortBy  } = query
        const page = Number(query.page) || 1
        const limit = Number(query.limit)||10
        const skip = (page - 1) * limit
        
        const queryBuilder = this.productRepo.createQueryBuilder('product')
        if (categoryFilter && categoryFilter != 'all') {
        queryBuilder.where(`product.category = :category`, { category: categoryFilter })
            
        }
        
        if (minPrice !== undefined) {
            queryBuilder.andWhere(`product.price>=:minPrice`,{minPrice})
        }
        
        if (maxPrice !== undefined) {
            queryBuilder.andWhere(`product.price<=:maxPrice`,{maxPrice})
        }

        if (searchQuery) {
            queryBuilder.andWhere(`(LOWER(product.title) LIKE LOWER(:searchQuery))`,{searchQuery:`%${searchQuery}%`})
        }

        if (sortBy && sortOrder && sortOrder!=='default') {
            queryBuilder.orderBy(`product.${sortBy}`,sortOrder.toUpperCase() as 'DESC'|'ASC')
        } else {
            queryBuilder.orderBy('product.id','DESC')
        }

        queryBuilder.skip(skip).take(limit)

        
        const [data, total] = await queryBuilder.getManyAndCount()
        

        const totalPages = Math.ceil(total / limit)
        return {
            data,total,page,limit,totalPages
        }
    }

    async getOneProduct(id:number) {
        return await postgresDataSource.manager.findOneBy(Product, {id})
    }

    async updateProduct(id: number,updateData:UpdateProduct) {
        const product = await this.productRepo.preload({
            id,
            ...updateData
        })
        if (!product) {
            throw new NotFoundException('Không tìm thấy sản phẩm')
        }

        return await this.productRepo.save(product)
        
    }

}
