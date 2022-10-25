import { SERVER_NAME } from '/@/utils/config';
export const dictionaryBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/dictionary/`;

export const dictPageApi = `${dictionaryBaseApi}page`;
export const teacherPositionApi = `${dictionaryBaseApi}listFilter/teacher-position`;
export const teacherTitleApi = `${dictionaryBaseApi}listFilter/teacher-title`;
export const teacherWorkTypeApi = `${dictionaryBaseApi}listFilter/teacher-workType`;
