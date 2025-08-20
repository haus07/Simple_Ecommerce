import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn,CreateDateColumn,DeleteDateColumn,UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()

export class OrderItems{
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToOne(() => Product, product => product.orderItems)
    product: Product
    
    @ManyToOne(() => Order, order => order.items)
    order: Order
    
    @Column({ type: 'decimal' })
    quantity: number
  
    @Column({
      type: 'decimal',
      default:0
    })
    originalCartItemId:number  

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updateAt: Date
      
    @DeleteDateColumn()
    deletedAt?: Date
}