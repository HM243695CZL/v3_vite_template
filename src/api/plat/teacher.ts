import { SERVER_NAME} from '/@/utils/config';
export const teacherBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/teacher/`;

export const getTeacherPageApi = `${teacherBaseApi}page`;
export const deleteTeacherApi = `${teacherBaseApi}delete`;
export const createTeacherApi = `${teacherBaseApi}create`;
export const updateTeacherApi = `${teacherBaseApi}update`;
export const resetPasswordApi = `${SERVER_NAME.SECURITY_SERVER}sys/user/resetPassword`;
