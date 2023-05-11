import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Manifestation} from "./manifestation.entity";
import {CreateManifestationDto} from "./dto/create-manifestation.dto";
import {MessagePattern} from "@nestjs/microservices";
import {UpdateManifestationDto} from "./dto/update-manifestation.dto";

@Injectable()
export class ManifestationService {

  constructor(
    @InjectRepository(Manifestation)
    private readonly manifestationRepository: Repository<Manifestation>
  ) {}

  @MessagePattern('findAll')
  async findAll() {
    return this.manifestationRepository.find();
  }

  async findOne(id: string) {
    const manifestation = await this.manifestationRepository.findOne({where: {id}});
    console.log('service :', id);
    return manifestation;
  }

  async create( createManifestationDto: CreateManifestationDto ): Promise<Manifestation> {
    const manifestation = new Manifestation();
    manifestation.title = createManifestationDto.title;
    manifestation.description = createManifestationDto.description;
    return this.manifestationRepository.save(manifestation);
  }

  async update(id: string, updateManifestationDto: UpdateManifestationDto): Promise<Manifestation> {
    const manifestation = await this.manifestationRepository.findOne({where: {id}});
    manifestation.title = updateManifestationDto.title;
    manifestation.description = updateManifestationDto.description;
    return this.manifestationRepository.save(manifestation);
  }
}
