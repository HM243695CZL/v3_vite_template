<template>
	<div class='roles-container h100' ref='rolesRef'>
		<CommonTop
			@clickAdd='clickAdd'
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			@clickBatchDelete='clickBatchDelete'
			:button-auth='["addBtn", "searchBtn", "resetBtn"]'
		>
			<template #right>
				<el-form-item label='角色'>
					<el-input placeholder='请输入角色' v-model='searchParams.name'></el-input>
				</el-form-item>
				<el-form-item label='创建人'>
					<el-input placeholder='请输入创建人' v-model='searchParams.operator'></el-input>
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
		>
			<vxe-column type='seq' title='序号' width='60' />
			<vxe-column field='name' title='角色' />
			<vxe-column field='remark' title='备注' />
			<vxe-column field='gmtCreate' title='创建时间' :formatter='formatTime' />
			<vxe-column field='operator' title='创建人' />
			<vxe-column title='操作' width='310'>
				<template #default='scope'>
					<el-button size='small' type="primary" @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button size='small' type="default" @click='clickDivideAuth(scope.row.id)'>分配权限</el-button>
					<el-button size='small' type="default" @click='clickDivideUser(scope.row)'>分配用户</el-button>
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
		<RoleModal
			ref='modalFormRef'
			@refreshList='getDataList'
		/>
		<DivideAuthModal
			ref='divideAuthModalRef'
		/>
		<DivideUserModal
			ref='divideUserModalRef'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import { deleteRoleApi, getRolePageApi } from '/@/api/plat/role';
import RoleModal from './component/role/roleModal.vue';
import DivideAuthModal from './component/role/divideAuthModal.vue';
import DivideUserModal from './component/role/divideUserModal.vue';
import XEUtils from 'xe-utils';

export default defineComponent({
	name: 'roles',
	components: {
		CommonTop,
		RoleModal,
		DivideAuthModal,
		DivideUserModal
	},
	setup() {
		const rolesRef = ref();
		const divideAuthModalRef = ref();
		const divideUserModalRef = ref();
		const state = reactive({
			uris: {
				page: getRolePageApi,
				delete: deleteRoleApi
			},
			otherHeight: 156,
		});
		const formatTime = ({ cellValue }) => {
			return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
		};
		const clickDivideAuth = (id: string) => {
			divideAuthModalRef.value.openDialog({id});
		};
		const clickDivideUser = (row: any) => {
			divideUserModalRef.value.openDialog(row);
		};
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
			clickDelete,
			clickBatchDelete,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: rolesRef
		});
		return {
			rolesRef,
			divideAuthModalRef,
			divideUserModalRef,
			clickDivideAuth,
			clickDivideUser,
			formatTime,
			...toRefs(state),


			clickAdd,
			clickEdit,
			getDataList,
			changePageIndex,
			changePageSize,
			filterChange,
			clickSearch,
			clickReset,
			clickDelete,
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
	.roles-container{
		padding: 20px;
		overflow: auto;
	}
</style>
