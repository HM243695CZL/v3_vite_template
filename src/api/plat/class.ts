import { SERVER_NAME } from '/@/utils/config';
export const classBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/classes/`;

export const getClassPageApi = `${classBaseApi}page`;
export const deleteClassPageApi = `${classBaseApi}delete`;
export const batchDeleteClassApi = `${classBaseApi}deleteAll`;
