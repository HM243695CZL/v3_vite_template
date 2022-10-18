import { PageEntity } from '/@/domain/page.entity';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { PaginationUtils } from '/@/utils/paginationUtils';
import { FilterEnum, FilterTypeEnum } from '/@/enum/filter.enum';
import { ElMessage } from 'element-plus';

export default {
	data() {
		return {
			pageInfo: new PageEntity(),
			dataList: [],
			searchParams: {},
			selectedRowKeys: [], // 被选中的数据主键
			selectionRows: [], // 被选中的数据行
		}
	},
	computed: {
		tableRowKey() {
			if (!this.tableName) {
				return '';
			}
			return this.$refs[this.tableName].rowKey || '';
		}
	},
	methods: {
		/**
		 * 加载表格数据
		 */
		getDataList() {
			if (!this.uris.page) {
				ElMessage.warning('请设置uris.page属性!');
				return false;
			}
			postAction(this.uris.page, this.pageInfo).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					this.dataList = res.datas.data;
					this.pageInfo.totalRecords = res.datas.totalRecords;
				}
			})
		},
		/**
		 * 点击查询
		 */
		clickSearch() {
			if (JSON.stringify(this.searchParams) === '{}') {
				this.pageInfo.filters = {};
			}
			for (const o in this.searchParams) {
				if (this.searchParams[o]) {
					this.pageInfo.filters[o] = PaginationUtils.filters(this.searchParams[o], FilterEnum.CONTAINS);
				} else {
					delete this.pageInfo.filters[o];
				}
				if (typeof this.searchParams[o] === 'number') {
					this.pageInfo.filters[o] = PaginationUtils.filters(this.searchParams[o], FilterEnum.EQUALS);
				}
				if (Array.isArray(this.searchParams[o])) {
					PaginationUtils.dealPageChange(this.pageInfo, o, this.searchParams[o].join(','), FilterEnum.IN, FilterTypeEnum.AND);
				}
			}
			this.pageInfo.first = 1;
			this.getDataList();
		},
		/**
		 * 点击重置
		 */
		clickReset() {
			this.pageInfo = new PageEntity();
			this.searchParams = {};
			this.clickSearch();
		},
		/**
		 * 选中表格数据
		 */
		selectionChange(selectionRows) {
			if (!this.tableName) {
				ElMessage.error('请为表格ref绑定tableName，并设置数据主键row-key'!)
				return false;
			}
			const selectedRowKeys = [];
			if (selectionRows && selectionRows.length > 0) {
				selectionRows.map((item: any) => {
					selectedRowKeys.push(item[this.tableRowKey])
				});
			}
			this.selectedRowKeys = selectedRowKeys;
			this.selectionRows = selectionRows;
		},
		/**
		 * 批量删除
		 */
		clickBatchDelete() {
			if (!this.uris.deleteBatch) {
				ElMessage.error('请设置uris.deleteBatch属性!');
				return false;
			}
			if (!this.selectedRowKeys || this.selectedRowKeys.length <= 0) {
				ElMessage.error('请选择需要删除的数据!');
				return false;
			}
			postAction(this.uris.deleteBatch, this.selectedRowKeys).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					this.selectedRowKeys = [];
					this.getDataList();
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
