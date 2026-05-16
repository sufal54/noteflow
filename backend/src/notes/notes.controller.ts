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
import {
  CreateNoteDto,
  NoteIdParamDto,
  RemoveSharedUserParamsDto,
  ShareNoteDto,
  UpdateNoteDto,
} from './dto/notes.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private notes: NotesService) {}

  @Get()
  getAll(@Req() req) {
    return this.notes.getAll(req.user.userId);
  }

  @Get(':id')
  getOne(@Param() param, @Req() req) {
    return this.notes.getOne(param.id, req.user.userId);
  }

  @Post()
  create(@Body() body: CreateNoteDto, @Req() req) {
    return this.notes.create(body, req.user.userId);
  }

  @Put(':id')
  update(@Param() param, @Body() body: UpdateNoteDto, @Req() req) {
    return this.notes.update(param.id, body, req.user.userId);
  }

  @Delete(':id')
  delete(@Param() param, @Req() req) {
    return this.notes.delete(param.id, req.user.userId);
  }

  @Post(':id/share')
  share(
    @Param() param: NoteIdParamDto,
    @Body() body: ShareNoteDto,
    @Req() req,
  ) {
    return this.notes.share(param.id, body.share_with_email, req.user.userId);
  }

  @Delete(':id/share/:userId')
  removeSharedUser(@Param() params: RemoveSharedUserParamsDto, @Req() req) {
    return this.notes.removeSharedUser(
      params.id,
      params.userId,
      req.user.userId,
    );
  }
}
