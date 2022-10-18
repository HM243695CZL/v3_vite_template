<template>
	<div class='teacher-container h100'>
		<el-card shadow="hover">
			<CommonTop @clickSearch='clickSearch' @clickReset='clickReset' @clickBatchDelete='clickBatchDelete'>
				<template #left>左侧插槽</template>
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
				ref='teacherTableRef'
				:data='dataList'
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
						<el-button size='small' type="primary">编辑</el-button>
						<el-button size='small' type="primary">重置密码</el-button>
						<el-button size='small' type="default">分配角色</el-button>
						<el-button size='small' type="danger">删除</el-button>
					</template>
				</vxe-column>
			</vxe-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
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
		</el-card>
	</div>
</template>

<script lang='ts'>
import { reactive, ref, toRefs, getCurrentInstance, onMounted, nextTick } from 'vue';
import crudMixin from '/@/mixin/crudMixin';
import { teacherBaseApi, teacherPositionApi, teacherTitleApi, teacherWorkTypeApi } from '/@/api/plat/teacher';
import CommonTop from '/@/components/CommonTop/index.vue';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';

export default {
	name: 'teacher',
	mixins: [crudMixin],
	components: {
		CommonTop
	},
	setup() {
		const { proxy } = getCurrentInstance();
		const addUserRef = ref();
		const updatePassRef = ref();
		const teacherTableRef = ref();
		const state = reactive({
			uris: {
				page: `${teacherBaseApi}page`,
				deleteBatch: `${teacherBaseApi}delete`
			},
			tableName: 'teacherTableRef',
			typeObj: {
				0: '专技',
				1: '工勤',
				2: '管理',
				3: '中干',
			},
			sexObj: {
				0: '男',
				1: '女'
			}
		});
		const filterChange = ({ filters }: any) => {
			if (filters.length === 0) {
				proxy.searchParams = {};
			} else {
				filters.map(item => {
					if (item.datas[0] === undefined) {
						proxy.searchParams[item.field] = item.values;
					} else {
						proxy.searchParams[item.field] = item.datas[0];
					}
				});
			}
			proxy.clickSearch();
		};
		const getPositionList = () => {
			postAction(teacherPositionApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const positionColumn = teacherTableRef.value.getColumnByField('position');
					const positionList = [] as any;
					res.datas.map((item: any) => {
						positionList.push({
							label: item.text,
							value: item.value
						})
					});
					teacherTableRef.value.setFilter(positionColumn, positionList);
				}
			})
		};
		const getTitleList = () => {
			postAction(teacherTitleApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const titleColumn = teacherTableRef.value.getColumnByField('title');
					const titleList = [] as any;
					res.datas.map((item: any) => {
						titleList.push({
							label: item.text,
							value: item.value
						})
					});
					teacherTableRef.value.setFilter(titleColumn, titleList);
				}
			})
		};
		const getTypeList = () => {
			nextTick(() => {
				const typeColumn = teacherTableRef.value.getColumnByField('type');
				const typeList = [] as any;
				for (const o in state.typeObj) {
					typeList.push({
						label: state.typeObj[o],
						value: o
					})
				}
				teacherTableRef.value.setFilter(typeColumn, typeList);
			})
		};
		const getWorkTypeList = () => {
			postAction(teacherWorkTypeApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const workTypeColumn = teacherTableRef.value.getColumnByField('workType');
					const workTypeList = [] as any;
					res.datas.map((item: any) => {
						workTypeList.push({
							label: item.text,
							value: item.value
						})
					});
					teacherTableRef.value.setFilter(workTypeColumn, workTypeList);
				}
			})
		};
		const getSexList = () => {
			nextTick(() => {
				const sexColumn = teacherTableRef.value.getColumnByField('sex');
				const sexList = [] as any;
				for (const o in state.sexObj) {
					sexList.push({
						label: state.sexObj[o],
						value: o
					})
				}
				teacherTableRef.value.setFilter(sexColumn, sexList);
			})
		};
		onMounted(() => {
			getPositionList();
			getTitleList();
			getTypeList();
			getWorkTypeList();
			getSexList();
		});
		return {
			addUserRef,
			updatePassRef,
			filterChange,
			teacherTableRef,
			...toRefs(state),
		};
	}
};
</script>

<style scoped lang='scss'>
	.teacher-container{
	}
</style>
