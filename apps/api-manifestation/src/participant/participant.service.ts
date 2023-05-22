import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  create(createParticipantDto: CreateParticipantDto) {
    return 'This action adds a new participant';
  }

  findAll() {
    return `This action returns all participant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
