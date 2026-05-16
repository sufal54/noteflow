import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';

@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private notes: NotesService) {}

  @Get()
  getAll(@Req() req) {
    return this.notes.getAll(req.user.userId);
  }

  @Get(':id')
  getOne(@Param('id') id, @Req() req) {
    return this.notes.getOne(id, req.user.userId);
  }

  @Post()
  create(@Body() body, @Req() req) {
    return this.notes.create(body, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id, @Body() body, @Req() req) {
    return this.notes.update(id, body, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id, @Req() req) {
    return this.notes.delete(id, req.user.userId);
  }

  @Post(':id/share')
  share(@Param('id') id, @Body() body, @Req() req) {
    return this.notes.share(id, body.share_with_email, req.user.userId);
  }

  @Delete(':id/share/:userId')
  removeSharedUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.notes.removeSharedUser(id, userId, req.user.userId);
  }
}
