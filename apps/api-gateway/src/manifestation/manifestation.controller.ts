import {Body, Controller, Get, Param, Post, Put, Request} from '@nestjs/common';
import {ManifestationService} from "./manifestation.service";
import {CreateManifestationDto} from "./dto/create-manifestation.dto";
import {UpdateManifestationDto} from "./dto/update-manifestation";
import { Public } from '../authentication/decorators/public.decorator';


@Controller('manifestation')
export class ManifestationController {
  constructor(private readonly manifestationService: ManifestationService) {}

  @Get()
  @Public()
  findAll() {
    return this.manifestationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestationService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() createManifestationDto: CreateManifestationDto) {
    return this.manifestationService.create(createManifestationDto, req.user.sub);
  }

  @Put(':id')
  update(@Param() id: string, @Body() updateManifestationDto: UpdateManifestationDto) {
    return this.manifestationService.update(id, updateManifestationDto);
  }

  @Put(':id/join')
  joinManifestation(@Request() request, @Param() id: string) {
    return this.manifestationService.joinManifestation(id, request.user.sub);
  }
}
