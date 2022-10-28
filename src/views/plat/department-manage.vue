<template>
	<div class='department-manage-container h100'>
		<el-button size="default" type="primary" @click='clickAdd'>
			<el-icon>
				<ele-Plus />
			</el-icon>
			新增
		</el-button>
		<vxe-table
			border='inner'
			:data='dataList'
			align='left'
			:stripe='false'
			:tree-config='{
				rowField: "key"
			}'
		>
			<vxe-column field='title' title='部门名称' tree-node />
			<vxe-column field='leader' title='部门负责人' />
			<vxe-column field='leaderStr' title='部门领导' />
			<vxe-column field='telphone' title='部门电话' />
			<vxe-column field='fax' title='传真' />
			<vxe-column title='操作' width='240'>
				<template #default='scope'>
					<el-button size='small' type='primary' @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button size='small' type='primary' @click='clickAddSub(scope.row)'>添加子机构</el-button>
					<el-button size='small' type='danger' @click='clickDelete(scope.row.key)'>删除</el-button>
				</template>
			</vxe-column>
		</vxe-table>
		<DeptModal
			ref='modalFormRef'
			@refreshList='getDataList'
			:dept-list='dataList'
			:teacher-list='teacherList'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { getAction, postAction } from '/@/api/common';
import { deptListApi, deleteDeptApi } from '/@/api/plat/dept';
import { StatusEnum } from '/@/enum/status.enum';
import { getTeacherListApi } from '/@/api/plat/teacher';
import DeptModal from './component/dept/deptModal.vue';
import _ from 'lodash';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'department-manage',
	components: {
		DeptModal
	},
	setup() {
		const modalFormRef = ref();
		const state = reactive({
			dataList: [],
			teacherList: []
		});
		const getDataList = () => {
			getAction(deptListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.dataList = res.datas;
					buildData(res.datas);
				}
			});
		};
		const buildData = (data: any) => {
			data.map(item => {
				if (item.children && item.children.length > 0) {
					item.children.map(ele => {
						ele.parentId = item.key;
					});
					buildData(item.children);
				}
			})
		};
		const getTeacherList = () => {
			postAction(getTeacherListApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.teacherList = res.datas;
				}
			})
		};
		const clickAdd = () => {
			modalFormRef.value.openDialog();
		};
		const clickEdit = (row: any) => {
			modalFormRef.value.openDialog(_.cloneDeep(row));
		};
		const clickAddSub = (row: any) => {
			modalFormRef.value.openDialog(_.cloneDeep(row), true);
		};
		const clickDelete = (id: string) => {
			postAction(deleteDeptApi, {id}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					getDataList();
				}
			})
		};
		onMounted(() => {
			getDataList();
			getTeacherList();
		});
		return {
			clickAdd,
			clickEdit,
			clickAddSub,
			clickDelete,
			getDataList,
			modalFormRef,
			...toRefs(state)
		}
	}
});
</script>

<style scoped lang='scss'>
	.department-manage-container{
		padding: 20px;
		overflow: auto;
	}
</style>
