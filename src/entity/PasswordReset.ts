import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './User';

@Entity()
@Unique(['token'])
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.passwordResets)
    user: User;
}
