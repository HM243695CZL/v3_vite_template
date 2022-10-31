<template>
	<div class='dictionary-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='码键' prop='keyCode'>
					<el-input v-model='state.ruleForm.keyCode' placeholder='请输入码键'></el-input>
				</el-form-item>
				<el-form-item label='键值' prop='keyValue'>
					<el-input-number class='w100' :max='99' :min='0' v-model='state.ruleForm.keyValue' placeholder='请输入键值'></el-input-number>
				</el-form-item>
				<el-form-item label='标签' prop='type'>
					<el-input v-model='state.ruleForm.type' placeholder='请输入标签'></el-input>
				</el-form-item>
				<el-form-item label='描述' prop='description'>
					<el-input v-model='state.ruleForm.description' placeholder='请输入描述'></el-input>
				</el-form-item>
				<el-form-item label='排序' prop='orderLevel'>
					<el-input-number class='w100' :max='999' :min='0' v-model='state.ruleForm.orderLevel' placeholder='请输入排序'></el-input-number>
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
import { createDictApi, updateDictApi } from '/@/api/plat/dictionary';
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
			keyCode: '',
			keyValue: undefined,
			type: '',
			description: '',
			orderLevel: undefined
		},
		rules: {
			keyCode: [
				{ required: true, message: '请输入码键', trigger: 'blur' }
			],
			keyValue: [
				{ required: true, message: '请输入键值', trigger: 'blur' }
			],
			type: [
				{ required: true, message: '请输入标签', trigger: 'blur' }
			],
			orderLevel: [
				{ required: true, message: '请输入排序', trigger: 'blur' }
			]
		}
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any, isKey?: boolean) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		nextTick(() => {
			formRef.value.resetFields();
			if(row) {
				state.title = isKey ? '新增字典' : '修改字典';
				if (isKey) {
					state.ruleForm.type = row.type;
				} else {
					state.ruleForm = OtherUtil.cloneForm(state.ruleForm, row) as any;
				}
			} else {
				state.title = '新增字典';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateDictApi : createDictApi, state.ruleForm).then(res => {
					if (res.status === StatusEnum.SUCCESS) {
						ElMessage.success(res.message);
						closeDialog();
						emits('refreshList');
					}
				})
			}
		})
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
