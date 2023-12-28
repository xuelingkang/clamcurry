import { ipcMain } from 'electron';
import { UpdatePreferenceDto } from '@clamcurry/common';
import preferenceService from '../service/PreferenceService';

ipcMain.handle('preferenceService.find', () => preferenceService.find());
ipcMain.handle('preferenceService.update', (_event, dto: UpdatePreferenceDto) => preferenceService.update(dto));
