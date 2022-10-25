import request from '/@/utils/request';
import { SERVER_NAME } from '/@/utils/config';

export const baseUrl = import.meta.env.VITE_API_URL as any;
export const uploadUrl = `${baseUrl}${SERVER_NAME.UPLOAD_URL}`;
export const reviewFileUrl = `${baseUrl}${SERVER_NAME.SECURITY_SERVER}source/view/`;

export function postAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data
	})
}

export function getAction(url: string, data: any) {
	return request({
		url,
		method: 'get',
		data,
	})
}

export function uploadAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data,
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}

export function exportAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data,
		observe: 'response',
		responseType: 'blob'
	})
}
