import { SERVER_NAME } from '/@/utils/config';
export const roleBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/role/`;

export const showTeacherAuthApi = `${roleBaseApi}showAuth`;
export const userAuthApi = `${roleBaseApi}userAuth`;
