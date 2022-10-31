<template>
	<div class='sys-menu-container h100'>
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
			<vxe-column field='title' title='菜单名称' tree-node />
			<vxe-column field='url' title='链接' />
			<vxe-column field='showLevel' title='排序' :title-help='{message: "值越小，排序越高"}' />
			<vxe-column field='status' title='可见性'>
				<template #default='scope'>
					{{statusObj[scope.row.status]}}
				</template>
			</vxe-column>
			<vxe-column title='操作' width='240'>
				<template #default='scope'>
					<el-button size='small' type='primary' @click='clickEdit(scope.row.key)'>编辑</el-button>
					<el-button size='small' type='primary' @click='clickAddSub(scope.row.key)'>添加子菜单</el-button>
					<el-button size='small' type='danger' @click='clickDelete(scope.row.key)'>删除</el-button>
				</template>
			</vxe-column>
		</vxe-table>
		<MenuModal
			ref='modalFormRef'
			@refreshList='getDataList'
			:menu-tree-list='menuTreeList'
			:root-tree-id='rootTreeId'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { getMenuListTreeApi, getMenuPageApi, getMenuInfoApi, deleteMenuApi } from '/@/api/plat/menu';
import CommonTop from '/@/components/CommonTop/index.vue';
import { getAction, postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import MenuModal from './component/menu/menuModal.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'sys-menu',
	components: {
		CommonTop,
		MenuModal
	},
	setup() {
		const sysMenuRef = ref();
		const modalFormRef = ref();
		const state = reactive({
			dataList: [],
			statusObj: {
				1: '显示',
				0: '隐藏'
			},
			menuTreeList: [] as any,
			rootTreeId: '980989898999'
		});
		const getDataList = () => {
			postAction(getMenuPageApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.dataList = res.datas;
				}
			})
		};
		const getMenuListTree = () => {
			getAction(getMenuListTreeApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.menuTreeList = [{
						title: '根节点',
						key: state.rootTreeId,
						children: res.datas
					}]
				}
			});
		};
		const clickAdd = () => {
			modalFormRef.value.openDialog();
		};
		const clickEdit = (id: string) => {
			postAction(getMenuInfoApi, {id}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					modalFormRef.value.openDialog(res.datas);
				}
			});
		};
		const clickAddSub = (id: string) => {
			postAction(getMenuInfoApi, {id}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					modalFormRef.value.openDialog(res.datas, true);
				}
			});
		};
		const clickDelete = (id: string) => {
			postAction(deleteMenuApi, {id}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					getDataList();
				}
			});
		};
		onMounted(() => {
			getDataList();
			getMenuListTree();
		});
		return {
			getDataList,
			clickAdd,
			clickEdit,
			clickAddSub,
			clickDelete,
			sysMenuRef,
			modalFormRef,
			...toRefs(state),
		}
	}
});
</script>

<style scoped lang='scss'>
	.sys-menu-container{
		padding: 20px;
		overflow: auto;
	}
</style>
