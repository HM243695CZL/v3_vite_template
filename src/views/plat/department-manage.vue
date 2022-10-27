<template>
	<div class='department-manage-container h100' ref='deptRef'>
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
					<el-button size='small' type='primary'>编辑</el-button>
					<el-button size='small' type='primary'>添加子机构</el-button>
					<el-button size='small' type='danger'>删除</el-button>
				</template>
			</vxe-column>
		</vxe-table>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { getAction } from '/@/api/common';
import { deptListApi } from '/@/api/plat/dept';
import { StatusEnum } from '/@/enum/status.enum';

export default defineComponent({
	name: 'department-manage',
	components: {
	},
	setup() {
		const deptRef = ref();
		const state = reactive({
			dataList: []
		});
		const getDataList = () => {
			getAction(deptListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.dataList = res.datas;
				}
			});
		};
		const clickAdd = () => {

		};
		onMounted(() => {
			getDataList();
		});
		return {
			deptRef,
			clickAdd,
			getDataList,
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
