import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getNote(
    @Query('ended') includingEnded = false,
    @Query('skip') skip = 0,
    @Query('includeAll') includeAll = false,
    @Query('query') query = '',
  ): Promise<any> {
    try {
      const result = await this.noteService.findAll(
        includingEnded,
        skip,
        includeAll,
        query,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post()
  async createNote(@Body() data: any): Promise<any> {
    try {
      const result = await this.noteService.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //Patch  note
  @Patch(':id')
  async updateNote(@Param('id') id: string, @Body() data: any): Promise<any> {
    try {
      const result = await this.noteService.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //Delete note
  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<any> {
    try {
      const result = await this.noteService.delete(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
