import request from '/@/utils/request';
import { SERVER_NAME } from '/@/utils/config';

export function loginApi(data: any) {
	return request({
		url: `${SERVER_NAME.SECURITY_SERVER}sys/authorizing/login`,
		method: 'post',
		data
	})
}
