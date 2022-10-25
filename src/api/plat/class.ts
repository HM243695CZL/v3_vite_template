import { SERVER_NAME } from '/@/utils/config';
export const classBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/classes/`;

export const getClassPageApi = `${classBaseApi}page`;
export const createClassApi = `${classBaseApi}create`;
export const updateClassApi = `${classBaseApi}update`;
export const deleteClassPageApi = `${classBaseApi}delete`;
export const batchDeleteClassApi = `${classBaseApi}deleteAll`;
export const downloadClassTempApi = `${classBaseApi}down/downMBExcel`;
export const importClassTempApi = `${classBaseApi}classesImport`;
