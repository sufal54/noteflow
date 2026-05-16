import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './note.schema';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  getAll(userId: string) {
    return this.noteModel
      .find({
        isDeleted: false,
        $or: [{ owner: userId }, { sharedWith: userId }],
      })
      .populate('owner', 'email _id')
      .populate('sharedWith', 'email _id')
      .lean();
  }

  async getOne(id: string, userId: string) {
    const note = await this.noteModel.findById(id);
    if (!note || note.isDeleted) {
      throw new ForbiddenException();
    }

    const ownerId = note.owner.toString();

    const isOwner = ownerId === userId;

    const isShared = note.sharedWith
      .map((id) => id.toString())
      .includes(userId);
    if (!isOwner && !isShared) {
      throw new ForbiddenException();
    }

    return note;
  }

  create(data, userId: string) {
    return this.noteModel.create({ ...data, owner: userId });
  }

  async update(id: string, data: any, userId: string) {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException();
    }

    Object.assign(note, data);
    return note.save();
  }

  async delete(id: string, userId: string) {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException();
    }

    note.isDeleted = true;
    await note.save();
  }

  async share(id: string, email: string, userId: string) {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.owner.toString() !== userId) {
      throw new ForbiddenException();
    }

    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!note.sharedWith.includes(user._id)) {
      note.sharedWith.push(user._id);
      await note.save();
    }

    return { message: 'Note shared successfully' };
  }

  async removeSharedUser(
    noteId: string,
    targetUserId: string,
    ownerId: string,
  ) {
    const note = await this.noteModel.findById(noteId);

    if (!note) throw new NotFoundException('Note not found');

    if (note.owner.toString() !== ownerId) {
      throw new ForbiddenException();
    }

    note.sharedWith = note.sharedWith.filter(
      (id) => id.toString() !== targetUserId,
    );

    await note.save();

    return this.noteModel
      .findById(noteId)
      .populate('owner', 'email _id')
      .populate('sharedWith', 'email _id')
      .lean();
  }
}
