import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('refresh_token')
export class RefreshToken {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    
    
    @Column({
        type:'varchar'
    })
    token_hash: string
    
    @ManyToOne(() => User, user => user.refreshTokens, {onDelete:'CASCADE'})
    user: User
    
    
    
    @Column({
        type: 'varchar',
        length: 100,
        nullable:true
    })
    ip_address: string
    
    @Column({
        type:'timestamp'
    })
    expired_at: Date
    
    @Column({
        type:'timestamp'
    })
    created_at: Date
    
    @Column({
        default: null,
        nullable: true,
        type:'timestamp'
    })
    updated_at:Date

}