import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany ,CreateDateColumn,DeleteDateColumn,UpdateDateColumn} from "typeorm";
import { User } from "./user.entity";
import { CartItems } from "./cart-items.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItems, cartItem => cartItem.cart)
  items: CartItems[];

  @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updateAt: Date
    
    @DeleteDateColumn()
    deletedAt?: Date
}
