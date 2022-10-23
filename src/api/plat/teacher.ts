import { SERVER_NAME} from '/@/utils/config';
export const teacherBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/teacher/`;
export const teacherPositionApi = `${SERVER_NAME.SECURITY_SERVER}sys/dictionary/listFilter/teacher-position`;
export const teacherTitleApi = `${SERVER_NAME.SECURITY_SERVER}sys/dictionary/listFilter/teacher-title`;
export const teacherWorkTypeApi = `${SERVER_NAME.SECURITY_SERVER}sys/dictionary/listFilter/teacher-workType`;
export const createTeacherApi = `${teacherBaseApi}create`;
export const updateTeacherApi = `${teacherBaseApi}update`;
export const resetPasswordApi = `${SERVER_NAME.SECURITY_SERVER}sys/user/resetPassword`;
