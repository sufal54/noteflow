import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
    }),
    PassportModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, JwtStrategy],
})
export class NotesModule {}
