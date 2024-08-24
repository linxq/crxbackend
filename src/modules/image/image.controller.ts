import { Controller, Get, Post } from '@nestjs/common';
import { ImageService } from './image.service';
import { get } from 'http';
import { exitCircleStringify } from 'src/utils';
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

  @Post('/genMainImage')
  genMainImage() {
    return this.imageService.imageGen({});
  }

  @Get('/genMainImage')
  async genMainImageGet() {
    const json = await this.imageService.imageGen({});

    const str = exitCircleStringify(json);
    return JSON.parse(str);
  }
}
