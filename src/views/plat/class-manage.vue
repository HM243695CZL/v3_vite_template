<template>
	<div class='class-manage-container h100' ref='classRef'>
		<div class='content-container h100'>
			<div class='tree-box h100'>
				<div class='title'>学院/专业管理</div>
				<DeptTree @clickNode='clickNode' />
			</div>
			<div class='class-manage-box h100'>
				<CommonTop
					@clickAdd='clickAdd'
					@clickSearch='clickSearch'
					@clickReset='clickReset'
					@clickBatchDelete='clickBatchDelete'
				>
					<template #right>
						<el-form-item label='班级名称'>
							<el-input placeholder='请输入班级名称' v-model='searchParams.name'></el-input>
						</el-form-item>
					</template>
				</CommonTop>
				<vxe-table
					ref='tableRef'
					:data='dataList'
					:max-height='tableHeight - otherHeight'
					:row-config='{
						useKey: true,
						keyField: "id"
					}'
					@checkbox-all='selectionChange'
					@checkbox-change='selectionChange'
				>
					<vxe-column type='checkbox' width='60' />
					<vxe-column field='xqmc' title='校区' />
					<vxe-column field='schoolYear' title='年级' />
					<vxe-column field='name' title='班级名称' />
					<vxe-column field='headTeacher' title='班主任' />
					<vxe-column field='monitor' title='班长' />
					<vxe-column field='telphone' title='班长联系电话' />
					<vxe-column field='remark' title='备注' />
					<vxe-column title='操作' width='150'>
						<template #default="scope">
							<el-button size='small' type="primary" @click='clickEdit(scope.row)'>编辑</el-button>
							<el-button size='small' type="danger" @click='clickDelete(scope.row.id)'>删除</el-button>
						</template>
					</vxe-column>
				</vxe-table>
				<el-pagination
					@size-change="changePageSize"
					@current-change="changePageIndex"
					class="mt15"
					:pager-count="5"
					:page-sizes="[10, 20, 30]"
					v-model:current-page="pageInfo.first"
					background
					v-model:page-size="pageInfo.rows"
					layout="total, sizes, prev, pager, next, jumper"
					:total="pageInfo.totalRecords"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import DeptTree from '/@/components/DeptTree/index.vue';
import { batchDeleteClassApi, deleteClassPageApi, getClassPageApi } from '/@/api/plat/class';
import CommonTop from '/@/components/CommonTop/index.vue';
import useCrud from '/@/hooks/useCrud';

export default defineComponent({
	name: 'class-manage',
	components: {
		DeptTree,
		CommonTop
	},
	setup() {
		const classRef = ref();
		const state = reactive({
			uris: {
				page: getClassPageApi,
				deleteBatch: batchDeleteClassApi,
				delete: deleteClassPageApi
			},
			otherHeight: 156, // 20 + 20 + 36 + 15 + 50 + 15
		});
		const {
			clickAdd,
			clickEdit,
			getDataList,
			changePageIndex,
			changePageSize,
			filterChange,
			selectionChange,
			clickSearch,
			clickReset,
			clickBatchDelete,
			clickDelete,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: classRef,
			isMountedLoad: false,
			initField: ['majorId']
		});
		const clickNode = node => {
			searchParams.value.majorId = node.key;
			clickSearch();
		};
		return {
			clickNode,
			classRef,
			...toRefs(state),

			clickAdd,
			clickEdit,
			getDataList,
			changePageIndex,
			changePageSize,
			filterChange,
			clickSearch,
			clickReset,
			clickBatchDelete,
			clickDelete,
			selectionChange,
			pageInfo,
			dataList,
			searchParams,
			tableRef,
			modalFormRef,
			tableHeight
		}
	}
});
</script>

<style scoped lang='scss'>
	.class-manage-container{
		padding: 20px;
		overflow: auto;
		.content-container{
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.tree-box{
				padding-right: 15px;
				overflow-y: scroll;
				.title{
					font-weight: 700;
					margin-bottom: 15px;
				}
			}
			.class-manage-box{
				flex: 1;
				padding-left: 15px;
			}
		}
	}
</style>
