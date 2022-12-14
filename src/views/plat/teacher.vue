<template>
	<div class='teacher-container h100' ref='teacherRef'>
		<CommonTop
			@clickAdd='clickAdd'
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			@clickBatchDelete='clickBatchDelete'>
			<template #right>
				<el-form-item label='姓名'>
					<el-input placeholder='请输入姓名' v-model='searchParams.name'></el-input>
				</el-form-item>
				<el-form-item label='工号'>
					<el-input placeholder='请输入工号' v-model='searchParams.number'></el-input>
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
		>
			<vxe-column type='checkbox' width='60' />
			<vxe-column field='name' title='姓名'/>
			<vxe-column field='number' title='工号' />
			<vxe-column field='orgName' title='部门' :filters="[{ data: '' }]" >
				<template #filter="{ $panel, column }">
					<el-input class='input-filter' v-for="(option, index) in column.filters" :key="index"
										v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)"
										@keyup.enter="$panel.confirmFilter()" placeholder="请输入部门" />
				</template>
			</vxe-column>
			<vxe-column field='position' title='职务' :filters='[]' />
			<vxe-column field='title' title='职称' :filters='[]' />
			<vxe-column field='type' title='岗位类型' :filters='[]'>
				<template #default='scope'>
					{{typeObj[scope.row.type]}}
				</template>
			</vxe-column>
			<vxe-column field='workType' title='任职类型' :filters='[]' />
			<vxe-column field='sex' title='性别' :filters='[]'>
				<template #default='scope'>
					{{sexObj[scope.row.sex]}}
				</template>
			</vxe-column>
			<vxe-column field='telphone' title='电话'/>
			<vxe-column field='email' title='邮箱' />
			<vxe-column title='操作' width='310'>
				<template #default="scope">
					<el-button size='small' type="primary" @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button size='small' type="primary" @click='clickResetPassword(scope.row.id)'>重置密码</el-button>
					<el-button size='small' type="default" @click='clickShowAuth(scope.row.id)'>分配角色</el-button>
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
		 />
		<TeacherModal ref='modalFormRef'
									@refreshList='getDataList'
									:dept-list='deptList'
									:position-list='positionList'
									:title-list='titleList'
									:type-list='typeObj'
									:work-type-list='workTypeList'
									:sex-list='sexObj'
		/>
		<DivideRoleModal ref='divideRoleModalRef' />
	</div>
</template>

<script lang='ts'>
import { reactive, ref, toRefs, onMounted, nextTick } from 'vue';
import {
	getTeacherPageApi,
	deleteTeacherApi
} from '/@/api/plat/teacher';
import {
	teacherPositionApi,
	teacherWorkTypeApi,
	teacherTitleApi
} from '/@/api/plat/dictionary';
import CommonTop from '/@/components/CommonTop/index.vue';
import { postAction, getAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import useCrud from '/@/hooks/useCrud';
import TeacherModal from './component/teacher/teacherModal.vue'
import DivideRoleModal from './component/teacher/divideRoleModal.vue';
import { deptListApi } from '/@/api/plat/dept';
import { ElMessage } from 'element-plus';
import { resetPasswordApi } from '/@/api/plat/user';

export default {
	name: 'teacher',
	components: {
		CommonTop,
		TeacherModal,
		DivideRoleModal
	},
	setup() {
		const addUserRef = ref();
		const updatePassRef = ref();
		const divideRoleModalRef = ref();
		const teacherRef = ref();
		const state = reactive({
			uris: {
				page: getTeacherPageApi,
				deleteBatch: deleteTeacherApi,
			},
			typeObj: {
				0: '专技',
				1: '工勤',
				2: '管理',
				3: '中干',
			},
			sexObj: {
				0: '男',
				1: '女',
			},
			otherHeight: 156, // 20 + 20 + 36 + 15 + 50 + 15
			deptList: [],
			positionList : [] as any,
			titleList: [] as any,
			workTypeList: [] as any
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
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: teacherRef
		});
		const getPositionList = () => {
			postAction(teacherPositionApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const positionColumn = tableRef.value.getColumnByField('position');
					res.datas.map((item: any) => {
						state.positionList.push({
							id: item.id,
							label: item.text,
							value: item.value
						})
					});
					tableRef.value.setFilter(positionColumn, state.positionList);
				}
			})
		};
		const getTitleList = () => {
			postAction(teacherTitleApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const titleColumn = tableRef.value.getColumnByField('title');
					res.datas.map((item: any) => {
						state.titleList.push({
							id: item.id,
							label: item.text,
							value: item.value
						})
					});
					tableRef.value.setFilter(titleColumn, state.titleList);
				}
			})
		};
		const getTypeList = () => {
			nextTick(() => {
				const typeColumn = tableRef.value.getColumnByField('type');
				const typeList = [] as any;
				for (const o in state.typeObj) {
					typeList.push({
						label: state.typeObj[o],
						value: o
					})
				}
				tableRef.value.setFilter(typeColumn, typeList);
			})
		};
		const getWorkTypeList = () => {
			postAction(teacherWorkTypeApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const workTypeColumn = tableRef.value.getColumnByField('workType');
					res.datas.map((item: any) => {
						state.workTypeList.push({
							id: item.id,
							label: item.text,
							value: item.value
						})
					});
					tableRef.value.setFilter(workTypeColumn, state.workTypeList);
				}
			})
		};
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
		const clickShowAuth = (id: string) => {
			divideRoleModalRef.value.openDialog(id);
		};
		const clickDelete = (id: string) => {
			postAction(state.uris.deleteBatch, [id]).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					clickSearch();
				}
			})
		};
		onMounted(() => {
			getPositionList();
			getTitleList();
			getTypeList();
			getWorkTypeList();
			getSexList();
			getDeptList();
		});
		return {
			addUserRef,
			updatePassRef,
			divideRoleModalRef,
			teacherRef,
			clickResetPassword,
			clickShowAuth,
			clickDelete,
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
			selectionChange,
			pageInfo,
			dataList,
			searchParams,
			tableRef,
			modalFormRef,
			tableHeight
		};
	}
};
</script>

<style scoped lang='scss'>
	.teacher-container{
		padding: 20px;
		overflow: auto;
	}
</style>
