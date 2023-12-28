import { ipcMain } from 'electron';
import { SaveThemeDto, UpdateThemeDto } from '@clamcurry/common';
import themeService from '../service/ThemeService';

ipcMain.handle('themeService.findAll', () => themeService.findAll());
ipcMain.handle('themeService.findById', (_event, id: number) => themeService.findById(id));
ipcMain.handle('themeService.save', (_event, dto: SaveThemeDto) => themeService.save(dto));
ipcMain.handle('themeService.update', (_event, dto: UpdateThemeDto) => themeService.update(dto));
ipcMain.handle('themeService.delete', (_event, id: number) => themeService.delete(id));
