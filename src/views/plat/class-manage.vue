<template>
	<div class='class-manage-container h100' ref='classRef'>
		<div class='content-container h100'>
			<div class='tree-box h100'>
				<div class='title'>学院/专业管理</div>
				<DeptTree @clickNode='clickNode'
									:tree-data='deptWithMajorList'
									:tree-props='{
										label: "name",
										children: "childrenList"
									}'
									/>
			</div>
			<div class='class-manage-box h100'>
				<CommonTop
					@clickAdd='clickAdd'
					@clickSearch='clickSearch'
					@clickReset='clickReset'
					@clickBatchDelete='clickBatchDelete'
				>
					<template #left>
						<el-button size='default' type='default' @click='clickImport'>
							<el-icon>
								<ele-Download />
							</el-icon>
							导入
						</el-button>
						<el-dropdown>
							<el-button size='default' type='default' class='ml10'>
								<el-icon>
									<ele-Upload />
								</el-icon>
								导出
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click='exportShow(1)'>导出选中</el-dropdown-item>
									<el-dropdown-item @click='exportShow(3)'>导出全部</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
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
				<ClassModal ref='modalFormRef'
										@refreshList='clickReset'
										:school-area-list='schoolAreaList'
										:dept-list='deptList'
										:teacher-list='teacherList'
				/>
				<ImportFileModal
					ref='ImportFileModalRef'
					@refreshList='getDataList'
				/>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import DeptTree from '/@/components/DeptTree/index.vue';
import {
	batchDeleteClassApi, deleteClassPageApi, getClassPageApi,
	exportClassDataApi
} from '/@/api/plat/class';
import {
	dictPageApi
} from '/@/api/plat/dictionary';
import {
	deptListApi, getTreeDeptWithMajorApi
} from '/@/api/plat/dept';
import {
	getTeacherListApi
} from '/@/api/plat/teacher';
import CommonTop from '/@/components/CommonTop/index.vue';
import useCrud from '/@/hooks/useCrud';
import ClassModal from './component/class/classModal.vue';
import ImportFileModal from './component/class/importFileModal.vue';
import {  getAction, postAction } from '/@/api/common';
import { PageEntity } from '/@/domain/page.entity';
import { PaginationUtils } from '/@/utils/paginationUtils';
import { FilterEnum } from '/@/enum/filter.enum';
import { StatusEnum } from '/@/enum/status.enum';
import { postDownLoad } from '/@/utils/postdown';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'class-manage',
	components: {
		DeptTree,
		CommonTop,
		ClassModal,
		ImportFileModal
	},
	setup() {
		const classRef = ref();
		const ImportFileModalRef = ref();
		const MajorModalRef = ref();
		const state = reactive({
			uris: {
				page: getClassPageApi,
				deleteBatch: batchDeleteClassApi,
				delete: deleteClassPageApi
			},
			otherHeight: 156, // 20 + 20 + 36 + 15 + 50 + 15
			pageInfo: new PageEntity(),
			schoolAreaList: [] as any,
			deptList: [] as any,
			deptWithMajorList: [] as any,
			teacherList: [] as any
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
			selectedRowKeys,
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
			searchParams.value.majorId = node.id;
			clickSearch();
		};
		const getSchoolAreaList = () => {
			state.pageInfo.filters.type = PaginationUtils.filters('school-type', FilterEnum.CONTAINS);
			postAction(dictPageApi, state.pageInfo).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.schoolAreaList = res.datas.data;
				}
			})
		};
		const getDeptList = () => {
			getAction(deptListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.deptList = res.datas;
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
		const getDeptWithMajorList = () => {
			postAction(getTreeDeptWithMajorApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.deptWithMajorList = res.datas;
				}
			})
		};
		const clickImport = () => {
			ImportFileModalRef.value.openDialog();
		};
		const exportShow = (mode: number) => {
			const obj = {
				1: {
					mode,
					pager: {},
					sourceIds: selectedRowKeys.value
				},
				3: {
					mode,
					pager: pageInfo.value,
					sourceIds: []
				}
			}
			if (mode === 1 && selectedRowKeys.value.length === 0) {
				ElMessage.error('请选择至少一条数据');
				return false;
			}
			postDownLoad(exportClassDataApi, obj[mode]);
		};
		onMounted(() => {
			getSchoolAreaList();
			getDeptList();
			getTeacherList();
			getDeptWithMajorList();
		});
		return {
			clickNode,
			clickImport,
			exportShow,
			classRef,
			ImportFileModalRef,
			MajorModalRef,
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
