<template>
	<div class='divide-user-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<div class='info'>
				<span class='role-name'>角色名称：{{state.roleInfo.name}}</span>
				<span>备注：{{state.roleInfo.remark}}</span>
			</div>
			<el-button type='primary' @click='clickAddUser'>添加人员</el-button>
			<el-button type='primary' @click='clickRemove("")'>移除</el-button>
			<div class='table-box'>
				<vxe-table
					:data='state.dataList'
					max-height='300'
					:row-config='{
						useKey: true,
						keyField: "id"
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
					<vxe-column title='操作' width='100'>
						<template #default='scope'>
							<el-button type='primary' @click='clickRemove(scope.row.userId)'>移除</el-button>
						</template>
					</vxe-column>
				</vxe-table>
			</div>
			<template #footer>
				<div class='dialog-footer'>
					<el-button @click='closeDialog'>关 闭</el-button>
				</div>
			</template>
			<AddUserModal
				ref='addUserModalRef'
				@refreshList='getDataList'
			/>
		</el-dialog>
	</div>
</template>

<script lang='ts' setup>
import { nextTick, reactive, ref } from 'vue';
	import { getUserAuthApi, deleteAuthApi } from '/@/api/plat/role';
	import { postAction } from '/@/api/common';
	import { StatusEnum } from '/@/enum/status.enum';
	import AddUserModal from './addUserModal.vue';
import { ElMessage } from 'element-plus';

	const addUserModalRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '分配用户',
		roleInfo: {
			id: ''
		},
		dataList: [],
		typeObj: {
			0: '专技',
			1: '工勤',
			2: '管理'
		},
		selectedRowKeys: [] as any, // 被选中的数据主键
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const getDataList = () => {
		postAction(getUserAuthApi, {
			id: state.roleInfo.id
		}).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.dataList = res.datas;
			}
		})
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.roleInfo = row;
		nextTick(() => {
			getDataList();
		});
	};
	const clickAddUser = () => {
		addUserModalRef.value.openDialog(state.roleInfo.id);
	};
	const clickRemove = (userId: string) => {
		if (!userId && state.selectedRowKeys.length === 0) {
			return false;
		}
		postAction(deleteAuthApi, {
			roleIds: [state.roleInfo.id],
			userIds: userId ? [userId] : state.selectedRowKeys
		}).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				ElMessage.success(res.message);
				getDataList();
			}
		})
	};
	const selectionChange = (selectionRows: any) => {
		const selectedRowKeys: string[] = [];
		(selectionRows.records || []).map((item: any) => {
			selectedRowKeys.push(item.userId);
		});
		state.selectedRowKeys = selectedRowKeys;
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>
	.divide-user-modal-container{
		.info{
			margin-bottom: 15px;
			font-weight: 700;
			.role-name{
				margin-right: 100px;
			}
		}
		.table-box{
			margin-top: 15px;
		}
	}
</style>
