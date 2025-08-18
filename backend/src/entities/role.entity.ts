import { Column, Entity, ManyToMany, PrimaryGeneratedColumn ,CreateDateColumn,DeleteDateColumn,UpdateDateColumn} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({type:"varchar"})
    name: string
    
    @ManyToMany(() => User, (user) => user.roles)
    users: User[]


    @CreateDateColumn()
      createdAt: Date
    
      @UpdateDateColumn()
      updateAt: Date
      
      @DeleteDateColumn()
      deletedAt?: Date
}