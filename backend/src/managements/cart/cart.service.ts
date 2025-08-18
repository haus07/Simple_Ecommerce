import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dtos/addToCart.dto';
import { CartItems } from 'src/entities/cart-items.entity';
import { UpdateQuantity } from './dtos/updateQuantity.dto';
import e from 'express';

@Injectable()
export class CartService {
     constructor(@InjectRepository(Cart)
            private cartRepo: Repository<Cart>,
            @InjectRepository(CartItems)
            private cartItemsRepo:Repository<CartItems>
        ) { }
    async addToCart(userId:number,dto:AddToCartDto){
        const cart = await this.cartRepo.findOne({
            where: { user: { id:userId } },
            relations: ['items','items.product']
        })
        console.log(dto.productId)
        if (!cart) {
            throw new NotFoundException('Người dùng không có giỏ hàng')
        }

        let cartItem = cart.items?.find(item => item.product.id === dto.productId)
        if (cartItem) {
            cartItem.quantity += 1
            await this.cartItemsRepo.save(cartItem)
        } else {
            cartItem = this.cartItemsRepo.create({
                product: { id: dto.productId },
                cart: { id: cart.id }
            })

            await this.cartItemsRepo.save(cartItem)
        }
        return {message:"Thêm vào giỏ hành thành công"}
    }
    

    async getCartItemsById(userId: number) {
         const cart = await this.cartRepo.findOne({
            where: { user: { id:userId } },
            relations: ['items','items.product']
        })

        if (!cart) {
            throw new NotFoundException('Người dùng chưa có giỏ hàng')
        }
        return cart
    }

    async updateQuantityByCartId(userId: number, cartItemId: number,quantity:UpdateQuantity) {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId }},
            relations: ['items.product']
        })

        if (!cart) {
            throw new NotFoundException('Khong tim thay gio hang ')
        }

        const cartItem = cart.items.find(item => item.id === cartItemId)
        if (!cartItem) {
            throw new NotFoundException('Khong tim thay san pham nay')
        }
        console.log(quantity.quantity)
        if (quantity.quantity === 0) {
            await this.cartItemsRepo.delete(cartItemId)
            console.log(cartItem)
        } else {
            cartItem.quantity = quantity.quantity
            await this.cartItemsRepo.save(cartItem)
        }
        const newQuantity = cartItem === undefined ? 0:quantity.quantity
        return {
            success: true,
            updateItem: {
                id: cartItemId,
                quantity:newQuantity
            }
        }
    }

    async countCartItems(id:number){
         const count = await this.cartItemsRepo.count({
        where: {
            cart: {
                user: { id }
            }
        }
    });
        return {
            count:count
        }
    }
}
