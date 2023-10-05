import { Controller } from '@nestjs/common';
import { ComicService } from './comic.service';
import { AdminService } from '../admin/admin.service';

@Controller('comic')
export class ComicController {
  constructor(
    private readonly comicService: ComicService,
    private readonly adminService: AdminService,
  ) {}
}
