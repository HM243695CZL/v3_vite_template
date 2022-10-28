import { SERVER_NAME } from '/@/utils/config';
export const semesterBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/semester/`;

export const getSemesterPageApi = `${semesterBaseApi}page`;
export const createSemesterApi = `${semesterBaseApi}create`;
export const updateSemesterApi = `${semesterBaseApi}update`;
export const deleteSemesterApi = `${semesterBaseApi}delete`;
