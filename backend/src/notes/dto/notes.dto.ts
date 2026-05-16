import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

export class ShareNoteDto {
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email',
    },
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  share_with_email!: string;
}

export class NoteIdParamDto {
  @IsMongoId({
    message: 'Invalid note id',
  })
  id!: string;
}

export class RemoveSharedUserParamsDto {
  @IsMongoId({
    message: 'Invalid note id',
  })
  id!: string;

  @IsMongoId({
    message: 'Invalid user id',
  })
  userId!: string;
}
