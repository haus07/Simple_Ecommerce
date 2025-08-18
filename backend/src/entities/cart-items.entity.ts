import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {default:1})
  quantity: number;

  @Column({ default: false ,type:'boolean'})
  selected:boolean

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date
  
  @DeleteDateColumn()
  deletedAt?: Date
  
}
