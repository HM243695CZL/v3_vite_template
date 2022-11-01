<template>
	<div class='role-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='角色' prop='name'>
					<el-input placeholder='请输入角色名称' v-model='state.ruleForm.name'></el-input>
				</el-form-item>
				<el-form-item label='备注' prop='remark'>
					<el-input placeholder='请输入备注' v-model='state.ruleForm.remark'></el-input>
				</el-form-item>
			</el-form>
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
import { createRoleApi, updateRoleApi } from '/@/api/plat/role';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { ElMessage } from 'element-plus';
import { OtherUtil } from '/@/utils/other.util';

	const emits = defineEmits([
		'refreshList'
	]);
	const formRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm: {
			id: '',
			name: '',
			remark: ''
		},
		rules: {
			name: [
				{ required: true, message: '角色名称不能为空', trigger: 'blur' }
			]
		}
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		nextTick(() => {
			formRef.value.resetFields();
			if (row) {
				state.title = '修改角色';
				state.ruleForm = OtherUtil.cloneForm(state.ruleForm, row) as any;
			} else {
				state.title = '新增角色';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateRoleApi : createRoleApi, state.ruleForm).then(res => {
					if (res.status === StatusEnum.SUCCESS) {
						ElMessage.success(res.message);
						closeDialog();
						emits('refreshList');
					}
				})
			}
		});
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
