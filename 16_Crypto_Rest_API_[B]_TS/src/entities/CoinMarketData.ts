import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//{ name: "coin_market_data" }
@Entity()
export class CoinMarketData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    market_name: string;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'timestamp'})
    saved_at: Date;
}