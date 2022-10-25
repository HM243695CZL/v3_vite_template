import { exportAction } from '/@/api/common';
import { ElMessage } from 'element-plus';

export function postDownLoad(url: string, data: any) {
	exportAction(url, data).then(res => {
		if (res) {
			const blobData = res.data;
			const r = new FileReader();
			r.readAsText(blobData);
			r.onload = function(e) {
				try {
					if (typeof this.result === 'string') {
						const resData = JSON.parse(this.result);
						ElMessage.warning(resData.message);
					}
				} catch (err) {
					const blob = res.data;
					const url = URL.createObjectURL(blob);
					const aTag = document.createElement('a');
					aTag.href = url;
					const contentDisposition = res.headers['content-disposition'];
					if (contentDisposition) {
						const fileName = contentDisposition.split(';')[1].split('=')[1];
						aTag.download = decodeURI(decodeURI(fileName));
						aTag.click();
						URL.revokeObjectURL(url);
						ElMessage.success('操作成功');
					} else {
						ElMessage.warning('操作失败');
					}
				}
			}
		}
	});
}
