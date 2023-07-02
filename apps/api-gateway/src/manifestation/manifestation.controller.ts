import {Body, Controller, Get, Param, Patch, Post, Put, Request} from '@nestjs/common';
import {ManifestationService} from "./manifestation.service";
import {CreateManifestationDto} from "./dto/create-manifestation.dto";
import {UpdateManifestationDto} from "./dto/update-manifestation";
import { Public } from '../authentication/decorators/public.decorator';

interface RequestWithUser extends Request {
  user: {
    sub: string;
  };
}

@Controller('manifestation')
export class ManifestationController {
  constructor(private readonly manifestationService: ManifestationService) {}

  @Get()
  @Public()
  findAll() {
    return this.manifestationService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.manifestationService.findOne(id);
  }

  @Post('/me')
  findMyManifestations(@Request() req: RequestWithUser) {
    return this.manifestationService.findMyManifestations(req.user.sub);
  }

  @Post()
  create(@Request() req, @Body() createManifestationDto: CreateManifestationDto) {
    return this.manifestationService.create(createManifestationDto, req.user.sub);
  }

  @Put(':id')
  update(@Param() id: string, @Body() updateManifestationDto: UpdateManifestationDto) {
    return this.manifestationService.update(id, updateManifestationDto);
  }

  @Patch(':id')
  joinManifestation(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.manifestationService.joinManifestation(id, req.user.sub);
  }

  @Patch(':id/left')
  leftManifestation(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.manifestationService.leftManifestation(id, req.user.sub);
  }
}
