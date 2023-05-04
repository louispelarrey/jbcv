import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TrashService {
    constructor(
        @Inject('TRASH') private readonly trashClient: ClientProxy,
        @Inject('USER') private readonly userClient: ClientProxy,
    ){}

    async findAll() {
        const test = await lastValueFrom(this.trashClient.send('findAll', { test: 'test'}));
        console.log('api-gateway',test);
        return test;
    }
}
