import { OrderStatus } from "../common/enums/order-status.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn ,ManyToOne,CreateDateColumn,DeleteDateColumn,UpdateDateColumn} from "typeorm";
import { User } from "./user.entity";
import { OrderItems } from "./order-items.entity";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        default: null,
        type: 'varchar'
    })
    orderCode: string
  
    
    @Column({ type: 'decimal' ,default:0})
    totalPrice: number
    
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default:OrderStatus.PENDING
    })
    status: OrderStatus
    
    @ManyToOne(() => User, user => user.orders)
    user: User
    
    @OneToMany(() => OrderItems, cartItem => cartItem.order, {cascade:true})
    items: OrderItems[]
    

    @CreateDateColumn({type:'timestamptz'})
      createdAt: Date
    
      @UpdateDateColumn()
      updateAt: Date
      
      @DeleteDateColumn()
      deletedAt?: Date
}

