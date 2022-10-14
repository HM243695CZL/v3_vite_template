import { PageEntity } from '/@/domain/page.entity';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';

export default {
	data() {
		return {
			pageInfo: new PageEntity(),
			dataList: [],
			searchParams: {}
		}
	},
	methods: {
		/**
		 * 加载表格数据
		 */
		getDataList() {
			postAction(this.uris.page, this.pageInfo).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					this.dataList = res.datas.data;
					this.pageInfo.totalRecords = res.datas.totalRecords;
				}
			})
		},
		/**
		 * 切换第几页
		 * @param index
		 */
		onHandleCurrentChange(index: number) {
			this.pageInfo.first = index;
			this.getDataList();
		},
		/**
		 * 切换每页条数
		 * @param size
		 */
		onHandleSizeChange(size: number) {
			this.pageInfo.rows = size;
			this.pageInfo.first = 1;
			this.getDataList();
		}
	},
	mounted() {
		this.getDataList();
	}
}
