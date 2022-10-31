import { SERVER_NAME } from '/@/utils/config';
export const menuBaseApi = `${SERVER_NAME.SECURITY_SERVER}sys/module/`;

export const createMenuApi = `${menuBaseApi}create`;
export const updateMenuApi = `${menuBaseApi}update`;
export const getMenuInfoApi = `${menuBaseApi}edit`;
export const deleteMenuApi = `${menuBaseApi}delete`;
export const getMenuPageApi = `${menuBaseApi}pageTree`;
export const getMenuListTreeApi = `${menuBaseApi}listTree`;
