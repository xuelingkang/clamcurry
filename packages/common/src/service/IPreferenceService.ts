import PreferenceVo from '../vo/PreferenceVo';
import UpdatePreferenceDto from '../dto/UpdatePreferenceDto';

export default interface IPreferenceService {
    find: () => Promise<PreferenceVo>;
    update: (dto: UpdatePreferenceDto) => Promise<void>;
}
