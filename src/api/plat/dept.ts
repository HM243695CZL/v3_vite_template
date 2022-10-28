import { SERVER_NAME } from '/@/utils/config';
export const deptBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/dept/`;
export const createDeptApi = `${deptBaseApi}create`;
export const updateDeptApi = `${deptBaseApi}update`;
export const deleteDeptApi = `${deptBaseApi}delete`;
export const deptListApi = `${deptBaseApi}list`;
export const getTreeDeptWithMajorApi = `${deptBaseApi}treeDeptWithMajor`;
