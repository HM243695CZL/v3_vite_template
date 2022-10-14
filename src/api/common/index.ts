import request from '/@/utils/request';

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
		data
	})
}
