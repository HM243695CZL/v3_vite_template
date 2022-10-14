<template>
	<div class='teacher-container h100'>
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-input v-model='searchParams.username' size="default" placeholder="请输入用户名称" style="max-width: 180px" clearable> </el-input>
				<el-button size="default" type="primary" class="ml10" @click='clickSearch'>
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser">
					新增用户
				</el-button>
			</div>
			<el-table border stripe :data="dataList" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column label='姓名' prop='name' show-overflow-tooltip />
				<el-table-column label='工号' prop='number' show-overflow-tooltip />
				<el-table-column label='部门' prop='orgName' show-overflow-tooltip />
				<el-table-column label='职务' prop='position' show-overflow-tooltip />
				<el-table-column label='职称' prop='title' show-overflow-tooltip />
				<el-table-column label='岗位类型' prop='type' show-overflow-tooltip >
					<template #default='scope'>
						{{typeObj[scope.row.type]}}
					</template>
				</el-table-column>
				<el-table-column label='任职类型' prop='workType' show-overflow-tooltip />
				<el-table-column label='性别' prop='sex' show-overflow-tooltip>
					<template #default='scope'>
						{{sexObj[scope.row.sex]}}
					</template>
				</el-table-column>
				<el-table-column label='电话' prop='telphone' show-overflow-tooltip />
				<el-table-column label='邮箱' prop='email' show-overflow-tooltip />
				<el-table-column label="操作" width="310">
					<template #default="scope">
						<el-button size="small" type="primary">编辑</el-button>
						<el-button size="small" type="primary">重置密码</el-button>
						<el-button size="small" type="default">分配角色</el-button>
						<el-button size="small" type="danger">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
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
import { defineComponent, reactive, ref, toRefs, getCurrentInstance } from 'vue';
import crudMixin from '/@/mixin/crudMixin';
import { teacherApi } from '/@/api/plat/teacher';

export default defineComponent({
	name: 'teacher',
	mixins: [crudMixin],
	setup() {
		const { proxy } = getCurrentInstance();
		const addUserRef = ref();
		const updatePassRef = ref();
		const state = reactive({
			uris: {
				page: `${teacherApi}page`
			},
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
		// 初始化表格数据
		const getUserPageList = () => {
		};
		const clickSearch = () => {
			state.pageIndex = 1;
			getUserPageList();
		}
		// 打开新增角色弹窗
		const onOpenAddUser = () => {
			addUserRef.value.openDialog();
		};
		// 打开修改角色弹窗
		const handleEdit = (row: any) => {
			addUserRef.value.openDialog(row);
		};
		const handleDelete = (row: any) => {

		};
		const handleEditPass = (row: any) => {
			updatePassRef.value.openDialog(row);
		};
		return {
			addUserRef,
			updatePassRef,
			handleEdit,
			handleDelete,
			handleEditPass,
			getUserPageList,
			onOpenAddUser,
			clickSearch,
			...toRefs(state),
		};
	}
});
</script>

<style scoped lang='scss'>
	.teacher-container{
	}
</style>
