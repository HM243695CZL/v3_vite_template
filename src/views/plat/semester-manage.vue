<template>
	<div class='semester-manage-container h100' ref='semesterRef'>
		<CommonTop @clickAdd='clickAdd' :button-auth='["addBtn"]' />
		<vxe-table
			ref='tableRef'
			:row-config='{
				useKey: true,
				keyField: "id"
			}'
			:data='dataList'
			:max-height='tableHeight - otherHeight'
		>
			<vxe-column title='序号' type='seq' width='60' />
			<vxe-column field='schoolYear' title='学年' />
			<vxe-column field='semester' title='学期' >
				<template #default='scope'>
					{{semesterObj[scope.row.semester]}}
				</template>
			</vxe-column>
			<vxe-column field='beginTime' title='开始时间' />
			<vxe-column field='endTime' title='结束时间' />
			<vxe-column title='操作' width='150'>
				<template #default='scope'>
					<el-button type='primary' size='small' @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button type='danger' size='small' @click='clickDelete(scope.row.id)'>删除</el-button>
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
		 />
		<SemesterModal
			ref='modalFormRef'
			@refreshList='getDataList'
			:school-year-list='schoolYearList'
			:semester-list='semesterObj'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { deleteSemesterApi, getSemesterPageApi } from '/@/api/plat/semester';
import CommonTop from '/@/components/CommonTop/index.vue';
import useCrud from '/@/hooks/useCrud';
import SemesterModal from './component/semester/semesterModal.vue';
import { formatDate } from '/@/utils/formatTime';

export default defineComponent({
	name: 'semester-manage',
	components: {
		CommonTop,
		SemesterModal
	},
	setup() {
		const semesterRef = ref();
		const state = reactive({
			uris: {
				page: getSemesterPageApi,
				delete: deleteSemesterApi
			},
			semesterObj: {
				0: '第一学期',
				1: '第二学期',
				2: '小学期'
			},
			startYear: 2013,
			schoolYearList: [] as any,
			otherHeight: 156,
		});
		const {
			clickAdd,
			clickEdit,
			clickDelete,
			getDataList,
			changePageIndex,
			changePageSize,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: semesterRef
		});
		onMounted(() => {
			for (let i = new Date().getFullYear(); i > state.startYear; i--) {
				state.schoolYearList.push({
					text: i + '-' + (i + 1) + '学年',
					value: i + '-' + (i + 1)
				});
			}
		});
		return {
			semesterRef,
			...toRefs(state),

			clickAdd,
			clickEdit,
			clickDelete,
			getDataList,
			changePageIndex,
			changePageSize,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			tableHeight
		}
	}
});
</script>

<style scoped lang='scss'>
	.semester-manage-container{
		padding: 20px;
		overflow: auto;
	}
</style>
