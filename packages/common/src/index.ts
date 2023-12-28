import ProtocolNameEnum from './enums/ProtocolNameEnum';
import EditorModeEnum from './enums/EditorModeEnum';
import LanguageEnum from './enums/LanguageEnum';
import OrderEnum from './enums/OrderEnum';
import NullsEnum from './enums/NullsEnum';
import ThemeBaseEnum from './enums/ThemeBaseEnum';
import NoteSortEnum from './enums/NoteSortEnum';
import Preference from './model/Preference';
import Theme from './model/Theme';
import Notebook from './model/Notebook';
import Note from './model/Note';
import NoteContent from './model/NoteContent';
import PreferenceVo from './vo/PreferenceVo';
import ThemeVo from './vo/ThemeVo';
import NotebookVo from './vo/NotebookVo';
import NoteVo from './vo/NoteVo';
import UpdatePreferenceDto from './dto/UpdatePreferenceDto';
import SaveThemeDto from './dto/SaveThemeDto';
import UpdateThemeDto from './dto/UpdateThemeDto';
import SaveNotebookDto from './dto/SaveNotebookDto';
import UpdateNotebookDto from './dto/UpdateNotebookDto';
import SaveNoteDto from './dto/SaveNoteDto';
import UpdateNoteDto from './dto/UpdateNoteDto';
import UploadFileDto from './dto/UploadFileDto';
import TimeUtils from './utils/TimeUtils';
import ArrayUtils from './utils/ArrayUtils';
import AssertUtils from './utils/AssertUtils';
import IPreferenceService from './service/IPreferenceService';
import IThemeService from './service/IThemeService';
import INotebookService from './service/INotebookService';
import INoteService from './service/INoteService';
import IMainEventService from './service/IMainEventService';
import IMainProcessService from './service/IMainProcessService';

export {
    ProtocolNameEnum,
    EditorModeEnum,
    LanguageEnum,
    OrderEnum,
    NullsEnum,
    ThemeBaseEnum,
    NoteSortEnum,
    Preference,
    Theme,
    Notebook,
    Note,
    NoteContent,
    PreferenceVo,
    ThemeVo,
    NotebookVo,
    NoteVo,
    UpdatePreferenceDto,
    SaveThemeDto,
    UpdateThemeDto,
    SaveNotebookDto,
    UpdateNotebookDto,
    SaveNoteDto,
    UpdateNoteDto,
    UploadFileDto,
    TimeUtils,
    ArrayUtils,
    AssertUtils,
    IPreferenceService,
    IThemeService,
    INotebookService,
    INoteService,
    IMainEventService,
    IMainProcessService,
};

declare global {
    interface Window {
        preferenceService: IPreferenceService;
        themeService: IThemeService;
        notebookService: INotebookService;
        noteService: INoteService;
        mainEventService: IMainEventService;
        mainProcessService: IMainProcessService;
    }
}
