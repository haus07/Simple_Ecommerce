import { Entity, PrimaryGeneratedColumn, Column, OneToMany,CreateDateColumn,DeleteDateColumn,UpdateDateColumn } from "typeorm";
import { CartItems } from "./cart-items.entity";
import { OrderItems } from "./order-items.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"varchar"})
  title: string;

  @Column({type:"varchar"})
  brand: string;

  @Column({type:"varchar"})
  category: string;

  @Column({ default: '' ,type:"varchar"})
  description: string;

  @Column("simple-json")
  images: string[];

  @Column({type:"varchar"})
  thumbnail: string;

  @Column({ default: 5 ,type:"varchar"})
  rating: number;

  @Column('decimal', { default: 0 })
  price: number;

  @OneToMany(() => CartItems, cartItem => cartItem.product)
  cartItems: CartItems[];

  @OneToMany(() => OrderItems, orderItem => orderItem.product)
  orderItems: OrderItems[]
  

  @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updateAt: Date
    
    @DeleteDateColumn()
    deletedAt?: Date
}
