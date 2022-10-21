import { onMounted, reactive, toRefs, computed, ref } from 'vue';
import { PageEntity } from '/@/domain/page.entity';
import { ElMessage } from 'element-plus';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { PaginationUtils } from '/@/utils/paginationUtils';
import { FilterEnum, FilterTypeEnum } from '/@/enum/filter.enum';
import _ from 'lodash';

export default function(params: any) {
	const { uris } = params;
	const tableRef = ref();
	const modalFormRef = ref();
	const state = reactive({
		pageInfo: new PageEntity(),
		dataList: [],
		searchParams: {} as any,
		selectedRowKeys: [] as any, // 被选中的数据主键
		selectionRows: [], // 被选中的数据行
	});
	/**
	 * 加载表格数据
	 */
	const getDataList = () => {
		if (!uris.page) {
			ElMessage.error('请设置uris.page属性!')
			return false;
		}
		postAction(uris.page, state.pageInfo).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.dataList = res.datas.data;
				state.pageInfo.totalRecords = res.datas.totalRecords;
			}
		})
	};
	/**
	 * 点击新增
	 */
	const clickAdd = () => {
		modalFormRef.value.openDialog();
	};
	/**
	 * 点击编辑
	 */
	const clickEdit = (row: any) => {
		modalFormRef.value.openDialog(_.cloneDeep(row));
	};
	/**
	 * 点击查询
	 */
	const clickSearch = () => {
		if (JSON.stringify(state.searchParams) === '{}') {
			state.pageInfo.filters = {};
		}
		for (const o in state.searchParams) {
			if (state.searchParams[o]) {
				state.pageInfo.filters[o] = PaginationUtils.filters(state.searchParams[o], FilterEnum.CONTAINS);
			} else {
				delete state.pageInfo.filters[o];
			}
			if (typeof state.searchParams[o] === 'number') {
				state.pageInfo.filters[o] = PaginationUtils.filters(state.searchParams[o], FilterEnum.EQUALS);
			}
			if (Array.isArray(state.searchParams[o])) {
				PaginationUtils.dealPageChange(state.pageInfo, o, state.searchParams[o].join(','), FilterEnum.IN, FilterTypeEnum.AND);
			}
		}
		state.pageInfo.first = 1;
		getDataList();
	};
	/**
	 * 点击重置
	 */
	const clickReset = () => {
		state.pageInfo = new PageEntity();
		state.searchParams = {};
		getDataList();
	};
	/**
	 * 构建过滤数据
	 */
	const filterChange = ({ filters }) => {
		if (filters.length === 0) {
			state.searchParams = {};
		} else {
			filters.map(item => {
				if (item.datas[0] === undefined) {
					state.searchParams[item.field] = item.values;
				} else {
					state.searchParams[item.field] = item.datas[0];
				}
			});
		}
		clickSearch();
	};
	/**
	 * 选中表格数据
	 */
	const selectionChange = (selectionRows: any) => {
		if (!tableRef.value.rowConfig) {
			ElMessage.error('请为表格ref绑定rowConfig，并设置数据主键');
			return false;
		}
		const selectedRowKeys: string[] = [];
		(selectionRows.records || []).map((item: any) => {
			selectedRowKeys.push(item[tableRowKey.value]);
		});
		state.selectedRowKeys = selectedRowKeys;
		state.selectionRows = selectionRows.records;
	}
	/**
	 * 批量删除
	 */
	const clickBatchDelete = () => {
		if (!uris.deleteBatch) {
			ElMessage.error('请设置uris.deleteBatch属性!')
			return false;
		}
		if (!state.selectedRowKeys || state.selectedRowKeys.length <= 0) {
			ElMessage.error('请选择需要删除的数据');
			return false;
		}
		postAction(uris.deleteBatch, state.selectedRowKeys).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				ElMessage.success(res.message);
				state.selectedRowKeys = [];
				getDataList();
			}
		})
	};
	/**
	 * 切换第几页
	 * @param index 第几页
	 */
	const changePageIndex = (index: number) => {
		state.pageInfo.first = index;
		getDataList();
	};
	/**
	 * 切换每页条数
	 * @param size 每页几条
	 */
	const changePageSize = (size: number) => {
		state.pageInfo.rows = size;
		state.pageInfo.first = 1;
		getDataList();
	};
	const tableRowKey = computed(() => {
		if (!tableRef.value) {
			return ''
		}
		return tableRef.value.rowConfig.keyField || '';
	});
	onMounted(() => {
		getDataList();
	});
	return {
		clickAdd,
		clickEdit,
		getDataList,
		clickSearch,
		clickReset,
		filterChange,
		selectionChange,
		clickBatchDelete,
		changePageIndex,
		changePageSize,
		tableRef,
		modalFormRef,
		...toRefs(state)
	}
}
