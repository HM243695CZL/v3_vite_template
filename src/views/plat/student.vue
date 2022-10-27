<template>
	<div class='student-container h100' ref='studentRef'>
		<CommonTop
			@clickAdd='clickAdd'
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			@clickBatchDelete='clickBatchDelete'>
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
							<el-dropdown-item @click='exportPage(1)'>导出选中</el-dropdown-item>
							<el-dropdown-item @click='exportPage(3)'>导出全部</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</template>
			<template #right>
				<el-form-item label='姓名'>
					<el-input placeholder='请输入姓名' v-model='searchParams.name'></el-input>
				</el-form-item>
				<el-form-item label='学号'>
					<el-input placeholder='请输入学号' v-model='searchParams.number'></el-input>
				</el-form-item>
			</template>
		</CommonTop>
		<vxe-table
			ref='tableRef'
			:row-config='{
				useKey: true,
				keyField: "id"
			}'
			:data='dataList'
			:max-height='tableHeight - otherHeight'
			@checkbox-all='selectionChange'
			@checkbox-change='selectionChange'
			@filter-change='filterChange'
			@sort-change='sortChange'
		>
			<vxe-column type='checkbox' width='60' />
			<vxe-column field='name' title='姓名' />
			<vxe-column field='number' title='学号' />
			<vxe-column field='xqmc' title='校区' />
			<vxe-column field='collegeName' title='部门' :filters="[{ data: '' }]" >
				<template #filter="{ $panel, column }">
					<el-input class='input-filter' v-for="(option, index) in column.filters" :key="index"
										v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)"
										@keyup.enter="$panel.confirmFilter()" placeholder="请输入部门" />
				</template>
			</vxe-column>
			<vxe-column field='majorName' title='专业' :filters="[{ data: '' }]" >
				<template #filter="{ $panel, column }">
					<el-input class='input-filter' v-for="(option, index) in column.filters" :key="index"
										v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)"
										@keyup.enter="$panel.confirmFilter()" placeholder="请输入专业" />
				</template>
			</vxe-column>
			<vxe-column field='className' title='班级' :filters="[{ data: '' }]">
				<template #filter="{ $panel, column }">
					<el-input class='input-filter' v-for="(option, index) in column.filters" :key="index"
										v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)"
										@keyup.enter="$panel.confirmFilter()" placeholder="请输入班级" />
				</template>
			</vxe-column>
			<vxe-column field='headTeacher' title='班主任' />
			<vxe-column field='sex' title='性别' :filters='[]'>
				<template #default='scope'>
					{{sexObj[scope.row.sex]}}
				</template>
			</vxe-column>
			<vxe-column field='type' title='学生类型' :filters='[]' >
				<template #default='scope'>
					{{typeObj[scope.row.type]}}
				</template>
			</vxe-column>
			<vxe-column field='schoolTime' title='入校时间' sortable />
			<vxe-column field='telphone' title='电话' />
			<vxe-column title='操作' width='310'>
				<template #default='scope'>
					<el-button size='small' type='default' @click='clickView(scope.row)'>查看</el-button>
					<el-button size='small' type='primary' @click='clickResetPassword(scope.row.id)'>重置密码</el-button>
					<el-button size='small' type='primary' @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button size='small' type='danger' @click='clickDelete(scope.row.id)'>删除</el-button>
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
		<StudentModal
			ref='modalFormRef'
			@refreshList='clickReset'
			:school-area-list='schoolAreaList'
			:dept-list='deptList'
			:sex-list='sexObj'
			:student-type-list='studentTypeList'
		/>
		<StuImportFileModal
			ref='StuImportFileModalRef'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import useCrud from '/@/hooks/useCrud';
import { getStudentPageApi, deleteStudentApi, exportStuPageApi } from '/@/api/plat/student';
import { dictPageApi } from '/@/api/plat/dictionary';
import { PageEntity } from '/@/domain/page.entity';
import { PaginationUtils } from '/@/utils/paginationUtils';
import { FilterEnum } from '/@/enum/filter.enum';
import { getAction, postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import StudentModal from './component/student/studentModal.vue';
import StuImportFileModal from './component/student/importFileModal.vue';
import { deptListApi } from '/@/api/plat/dept';
import { resetPasswordApi } from '/@/api/plat/user';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'student',
	components: {
		CommonTop,
		StudentModal,
		StuImportFileModal
	},
	setup() {
		const studentRef = ref();
		const StuImportFileModalRef = ref();
		const state = reactive({
			stuTypePageInfo: new PageEntity(),
			schoolAreaPageInfo: new PageEntity(),
			uris: {
				page: getStudentPageApi,
				deleteBatch: deleteStudentApi,
				exportUrl: exportStuPageApi
			},
			sexObj: {
				0: '男',
				1: '女',
			},
			typeFilterObj: {
				0: '本科生',
				1: '研究生',
				2: '博士生',
				3: '高职'
			},
			typeObj: {},
			otherHeight: 156,
			schoolAreaList: [] as any,
			deptList: [] as any,
			studentTypeList: [] as any
		});
		const {
			clickAdd,
			clickEdit,
			clickView,
			getDataList,
			changePageIndex,
			changePageSize,
			filterChange,
			sortChange,
			selectionChange,
			clickSearch,
			clickReset,
			exportPage,
			clickBatchDelete,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: studentRef
		});
		const getSexList = () => {
			nextTick(() => {
				const sexColumn = tableRef.value.getColumnByField('sex');
				const sexList = [] as any;
				for (const o in state.sexObj) {
					sexList.push({
						label: state.sexObj[o],
						value: o
					})
				}
				tableRef.value.setFilter(sexColumn, sexList);
			})
		};
		const getTypeList = () => {
			nextTick(() => {
				const typeColumn = tableRef.value.getColumnByField('type');
				const typeList = [] as any;
				for (const o in state.typeFilterObj) {
					typeList.push({
						label: state.typeFilterObj[o],
						value: o
					})
				}
				tableRef.value.setFilter(typeColumn, typeList);
			})
		};
		const getStudentTypeList = () => {
			state.stuTypePageInfo.filters.type = PaginationUtils.filters('edu-sort', FilterEnum.CONTAINS);
			PaginationUtils.sort(state.stuTypePageInfo, {field: 'type', order: 'asc'});
			PaginationUtils.sort(state.stuTypePageInfo, {field: 'orderLevel', order: 'asc'});
			postAction(dictPageApi, state.stuTypePageInfo).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.studentTypeList = res.datas.data;
					res.datas.data.map(item => {
						state.typeObj[item.keyValue] = item.keyCode;
					});
				}
			});
		};
		const getSchoolAreaList = () => {
			state.schoolAreaPageInfo.filters.type = PaginationUtils.filters('school-type', FilterEnum.CONTAINS);
			PaginationUtils.sort(state.schoolAreaPageInfo, {field: 'type', order: 'asc'});
			PaginationUtils.sort(state.schoolAreaPageInfo, {field: 'orderLevel', order: 'asc'});
			postAction(dictPageApi, state.schoolAreaPageInfo).then(res => {
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
		const clickResetPassword = (id: string) => {
			postAction(resetPasswordApi, {
				id
			}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
				}
			})
		};
		const clickDelete = (id: string) => {
			postAction(state.uris.deleteBatch, [id]).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					clickSearch();
				}
			})
		};
		const clickImport = () => {
			StuImportFileModalRef.value.openDialog();
		};
		onMounted(() => {
			getSexList();
			getTypeList();
			getStudentTypeList();
			getSchoolAreaList();
			getDeptList();
		})
		return {
			clickResetPassword,
			clickDelete,
			clickImport,
			studentRef,
			StuImportFileModalRef,
			...toRefs(state),

			clickAdd,
			clickEdit,
			clickView,
			getDataList,
			changePageIndex,
			changePageSize,
			filterChange,
			sortChange,
			clickSearch,
			clickReset,
			exportPage,
			clickBatchDelete,
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
	.student-container{
		padding: 20px;
		overflow: auto;
	}
</style>
