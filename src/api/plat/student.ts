import { SERVER_NAME } from '/@/utils/config';
export const studentBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/student/`;

export const getStudentPageApi = `${studentBaseApi}page`;
export const createStudentApi = `${studentBaseApi}create`;
export const updateStudentApi = `${studentBaseApi}update`;
export const deleteStudentApi = `${studentBaseApi}delete`;
export const downloadStuTempApi = `${studentBaseApi}downloadModule`;
export const importStuTempApi = `${studentBaseApi}importExcel`;
export const exportStuPageApi = `${studentBaseApi}exportExcel2`;
