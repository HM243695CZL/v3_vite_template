<template>
	<div class='divide-role-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 title='分配角色'
							 v-model='state.isShowDialog' width='800px'>
			<el-transfer v-model="state.roleIds"
									 filterable
									 filter-placeholder='请输入菜单名称'
									 :props="{
											key: 'key',
											label: 'title',
										}"
									 :right-default-checked='state.roleIds'
									 :titles='["未分配角色", "已分配角色"]'
									 :data="state.dataList" />
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
import { nextTick, reactive } from 'vue';
import { postAction} from '/@/api/common';
import {showTeacherAuthApi, userAuthApi} from '/@/api/plat/role';
import { StatusEnum } from '/@/enum/status.enum';
import { ElMessage } from 'element-plus';

const state = reactive({
	isShowDialog: false,
	dataList: [],
	roleIds: [] as any,
	userId: ''
});
const closeDialog = () => {
	state.isShowDialog = false;
};
const openDialog = (id: string) => {
	state.isShowDialog = true;
	state.userId = id;
	nextTick(() => {
		postAction(showTeacherAuthApi, {id}).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.dataList = res.datas;
				state.roleIds = [];
				state.dataList.map((item: any) => {
					if (item.direction === 'right') {
						state.roleIds.push(item.key);
					}
				})
			}
		});
	});
};
const clickConfirm = () => {
	postAction(userAuthApi, {
		roleIds: state.roleIds,
		userIds: [state.userId]
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
