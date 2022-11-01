<template>
	<div class='add-user-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<CommonTop
				@clickSearch='clickSearch'
				@clickReset='clickReset'
				:button-auth='["searchBtn", "resetBtn"]'
			>
				<template #right>
					<el-form-item label='姓名'>
						<el-input placeholder='请输入姓名' v-model='state.searchParams.name'></el-input>
					</el-form-item>
					<el-form-item label='工号'>
						<el-input placeholder='请输入工号' v-model='state.searchParams.number'></el-input>
					</el-form-item>
				</template>
			</CommonTop>
			<vxe-table
				:data='state.dataList'
				max-height='300'
				:row-config='{
					useKey: true,
					keyField: "id"
				}'
				:checkbox-config='{
					checkRowKeys: state.checkKeys
				}'
				@checkbox-all='selectionChange'
				@checkbox-change='selectionChange'
			>
				<vxe-column type='checkbox' width='60' />
				<vxe-column type='seq' title='序号' width='60' />
				<vxe-column field='name' title='姓名' />
				<vxe-column field='number' title='工号' />
				<vxe-column field='deptName' title='部门' />
				<vxe-column field='position' title='职位' />
				<vxe-column field='type' title='岗位类型'>
					<template #default='scope'>
						{{state.typeObj[scope.row.type]}}
					</template>
				</vxe-column>
				<vxe-column field='title' title='职称' />
			</vxe-table>
			<el-pagination
				@size-change="changePageSize"
				@current-change="changePageIndex"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="state.pageInfo.first"
				background
				v-model:page-size="state.pageInfo.rows"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.pageInfo.totalRecords"
			/>
			<template #footer>
				<div class='dialog-footer'>
					<el-button @click='closeDialog'>关 闭</el-button>
					<el-button type='primary' @click='clickConfirm'>确 定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang='ts' setup>
	import { nextTick, reactive } from 'vue';
	import CommonTop from '/@/components/CommonTop/index.vue';
	import { getUserSelectedAuthApi, assignUserApi } from '/@/api/plat/role';
	import { postAction } from '/@/api/common';
	import { StatusEnum } from '/@/enum/status.enum';
	import { PageEntity } from '/@/domain/page.entity';
	import { FilterEnum } from '/@/enum/filter.enum';
	import { PaginationUtils } from '/@/utils/paginationUtils';
	import { ElMessage } from 'element-plus';

	const emits = defineEmits([
		'refreshList'
	]);

	const state = reactive({
		isShowDialog: false,
		title: '添加人员',
		searchParams: {
			name: '',
			number: ''
		},
		selectedRowKeys: [] as any, // 被选中的数据主键
		selectionRows: [], // 被选中的数据行
		typeObj: {
			0: '专技',
			1: '工勤',
			2: '管理'
		},
		dataList: [],
		pageInfo: new PageEntity(),
		roleId: '',
		checkKeys: [] as Array<string>
	});
	const getDataList = () => {
		postAction(getUserSelectedAuthApi, state.pageInfo).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.dataList = res.datas.data;
				state.pageInfo.totalRecords = res.datas.totalRecords;
				state.dataList.map((item: any) => {
					if (item.checked) {
						state.checkKeys.push(item.id);
						state.selectedRowKeys.push(item.id);
					}
				})
			}
		})
	};
	const clickSearch = () => {
		for (const o in state.searchParams){
			if (state.searchParams[o]) {
				state.pageInfo.filters[o] = PaginationUtils.filters(state.searchParams[o], FilterEnum.CONTAINS);
			} else {
				delete state.pageInfo.filters[o];
			}
		}
		state.pageInfo.first = 1;
		getDataList();
	};
	const clickReset = () => {
		state.pageInfo = new PageEntity();
		state.pageInfo.filters.roleId = PaginationUtils.filters(state.roleId, FilterEnum.EQUALS);
		state.searchParams = {
			name: '',
			number: ''
		};
		getDataList();
	};
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const changePageSize = (size: number) => {
		state.pageInfo.rows = size;
		state.pageInfo.first = 1;
		getDataList();
	};
	const changePageIndex = (index: number) => {
		state.pageInfo.first = index;
		getDataList();
	};
	const openDialog = (roleId: any) => {
		state.isShowDialog = true;
		state.roleId = roleId;
		state.pageInfo.filters.roleId = PaginationUtils.filters(roleId, FilterEnum.EQUALS);
		nextTick(() => {
			clickReset();
		})
	};
	const selectionChange = (selectionRows: any) => {
		const selectedRowKeys: string[] = [];
		(selectionRows.records || []).map((item: any) => {
			selectedRowKeys.push(item.id);
		});
		state.selectedRowKeys = selectedRowKeys;
		state.selectionRows = selectionRows.records;
	};
	const clickConfirm = () => {
		postAction(assignUserApi, {
			roleId: state.roleId,
			userIdList: state.selectedRowKeys
		}).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				ElMessage.success(res.message);
				closeDialog();
				emits('refreshList');
			}
		})
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
