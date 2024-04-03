import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';
import { get } from 'http';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getHello(): string {
    return this.imageService.getHello1();
  }
  @Get('/sts')
  getSts() {
    return this.imageService.sts();
  }
}
