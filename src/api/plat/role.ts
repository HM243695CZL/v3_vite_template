import { SERVER_NAME } from '/@/utils/config';
export const roleBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/role/`;

export const getRolePageApi = `${roleBaseApi}page`;
export const createRoleApi = `${roleBaseApi}create`;
export const updateRoleApi = `${roleBaseApi}update`;
export const deleteRoleApi = `${roleBaseApi}delete`;
export const divideAuthApi = `${roleBaseApi}auth`;
export const showTeacherAuthApi = `${roleBaseApi}showAuth`;
export const viewRoleAuthApi = `${roleBaseApi}viewAuth`;
export const userAuthApi = `${roleBaseApi}userAuth`;
export const getUserAuthApi = `${roleBaseApi}queryUserAuth`;
export const getUserSelectedAuthApi = `${roleBaseApi}pageQueryUser`;
export const assignUserApi = `${roleBaseApi}assignUser`;
export const deleteAuthApi = `${roleBaseApi}deleteAuth`;
