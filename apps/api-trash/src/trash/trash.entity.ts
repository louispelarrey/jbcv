import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reference: string;

  @Column()
  description: string;

  @Column({type: 'float', default: 0.0})
  longitude: number;

  @Column({type: 'float', default: 0.0})
  latitude: number;

  @Column()
  address: string;

  @Column()
  posterId: string;

  @Column('jsonb', {default: []})
  burners: string[];

  @Column({ default: false })
  isBurned: boolean;

  @Column()
  fileImageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
