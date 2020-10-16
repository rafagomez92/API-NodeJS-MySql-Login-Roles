import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    Unique, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, isNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username']) //El campo que debe ser unico
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)    
    @IsEmail()
    @IsNotEmpty()
    username: string;
    
    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
    
    @Column()
    @IsNotEmpty()
    role: string;   

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        // también es valido hashSync(this.password, 10)  y saltar la línea anterior
        this.password = bcrypt.hashSync(this.password, salt);
    }
    
    checkPassword(password: string ): boolean {
        return bcrypt.compareSync(password, this.password);
    }


    
}
