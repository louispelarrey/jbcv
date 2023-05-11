import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TrashDto } from './dto/trash.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TrashService {
    constructor(
        @Inject('TRASH') private readonly trashClient: ClientProxy,
        @Inject('USER') private readonly userClient: ClientProxy,
    ){}

    async findAll() {
        return this.trashClient.send('findAll', {});
    }

    async findAllByUser(posterId: string) {
        const trashes = await lastValueFrom(this.trashClient.send('findAllByUser', posterId));
        const updatedTrashes = await Promise.all(
            trashes.map(async trash => {
                trash.poster = await lastValueFrom(this.userClient.send('findUserById', trash.posterId));
                return trash;
            }),
        );
        return updatedTrashes;
    }

    async findOne(id: string) {
        return this.trashClient.send('findOne', id);
    }

    async create(createTrashDto: TrashDto) {
        const trash = await lastValueFrom(this.trashClient.send('create', createTrashDto));
        trash.posterId = await lastValueFrom(this.userClient.send('findUserById', trash.posterId));
        return trash;
    }

    async update(id: string, updateTrashDto: TrashDto) {
        const trash = await lastValueFrom(this.trashClient.send('update', { id, updateTrashDto }));
        return this.trashClient.send('update', { id, updateTrashDto });
    }

    async updateBurner(id: string, updateTrashDto: TrashDto) {
        const trash = await lastValueFrom(this.trashClient.send('updateBurner', { id, updateTrashDto }));
        return this.trashClient.send('updateBurner', { id, updateTrashDto });
    }
}
