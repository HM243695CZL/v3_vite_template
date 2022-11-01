<template>
	<div class='divide-auth-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-tree
				:data='state.treeData'
				show-checkbox
				ref='authTreeRef'
				node-key='key'
				:default-checked-keys='state.checkedKeys'
				:props='{
						label: "title",
						value: "key"
					}'
			/>
			<template #footer>
				<div class='dialog-footer'>
					<el-button @click='closeDialog'>取 消</el-button>
					<el-button type='primary' @click='clickConfirm'>确 定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang='ts' setup>
import { nextTick, reactive, ref } from 'vue';
import { viewRoleAuthApi, divideAuthApi } from '/@/api/plat/role';
import { StatusEnum } from '/@/enum/status.enum';
import { postAction } from '/@/api/common';
import { ElMessage } from 'element-plus';

	const authTreeRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '分配权限',
		roleId: '',
		treeData: [],
		checkedKeys: []
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.roleId = row.id;
		nextTick(() => {
			state.checkedKeys = [];
			postAction(viewRoleAuthApi, {
				id: row.id
			}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.checkedKeys = res.datas.defuleSelectKeys;
					state.treeData = res.datas.modules;
				}
			})
		})
	};
	const clickConfirm = () => {
		postAction(divideAuthApi, {
			roleId: state.roleId,
			moduleIds: authTreeRef.value.getCheckedKeys()
		}).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				ElMessage.success(res.message);
				closeDialog();
			}
		})
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
