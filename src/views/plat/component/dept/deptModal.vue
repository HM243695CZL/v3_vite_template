<template>
	<div class='dept-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='上级部门' prop='parentId'>
					<el-tree-select v-model='state.ruleForm.parentId'
													:data='[{
														key: "0",
														title: "顶级部门",
														children: props.deptList
													}]'
													:check-strictly='true'
													placeholder='请选择部门'
													ref='deptTreeRef'
													filterable
													class='w100'
													disabled
													:props='{
																label: "title",
																value: "key"
															}' />
				</el-form-item>
				<el-form-item label='部门名称' prop='name'>
					<el-input v-model='state.ruleForm.name' placeholder='请输入部门名称'></el-input>
				</el-form-item>
				<el-form-item label='部门负责人' prop='leaderId'>
					<el-select multiple class='w100' placeholder='请选择部门负责人' filterable v-model='state.ruleForm.leaderId'>
						<el-option v-for='item of teacherList' :key='item.id' :label='item.name' :value='item.id'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='部门领导' prop='leaderList'>
					<el-select multiple class='w100' placeholder='请选择部门领导' filterable v-model='state.ruleForm.leaderList'>
						<el-option v-for='item of teacherList' :key='item.id' :label='item.name' :value='item.id'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='联系电话' prop='telphone'>
					<el-input v-model='state.ruleForm.telphone' placeholder='请输入联系电话'></el-input>
				</el-form-item>
				<el-form-item label='传真' prop='fax'>
					<el-input v-model='state.ruleForm.fax' placeholder='请输入传真'></el-input>
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
import { createDeptApi, updateDeptApi } from '/@/api/plat/dept';
import { StatusEnum } from '/@/enum/status.enum';
import { postAction } from '/@/api/common';
import { ElMessage } from 'element-plus';

const props = defineProps({
		deptList: {
			type: Array,
			required: true
		},
		teacherList: {
			type: Array,
			required: true
		}
	});
	const emits = defineEmits([
		'refreshList'
	]);
	const formRef = ref();
	const deptTreeRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm: {
			id: '',
			parentId: '',
			name: '',
			leaderId: [],
			leaderList: [],
			telphone: '',
			fax: ''
		},
		rules: {
			name: [
				{ required: true, message: '部门名称不能为空', trigger: 'blur' }
			]
		}
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any, isSub: boolean) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		nextTick(() => {
			formRef.value.resetFields();
			if (row) {
				state.title = isSub ? '新增部门' : '修改部门';
				if (!isSub) {
					state.ruleForm.id = row.key;
					state.ruleForm.parentId = row.parentId ? row.parentId : '0';
					deptTreeRef.value.setCurrentKey(state.ruleForm.parentId);
					state.ruleForm.name = row.title;
					if (row.leaderId !== 'undefined' && row.leaderId !== null && row.leaderId !== '') {
						state.ruleForm.leaderId = row.leaderId.split(',');
					}
					if (row.leaderIdStr) {
						state.ruleForm.leaderList = row.leaderIdStr.split(',');
					}
				} else {
					state.ruleForm.parentId = row.key;
					deptTreeRef.value.setCurrentKey(row.key);
				}
			} else {
				state.title = '新增部门';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				const arr = [] as any;
				state.ruleForm.leaderList.map((item: any) => {
					arr.push({
						leaderId: item
					})
				});
				postAction(state.ruleForm.id ? updateDeptApi : createDeptApi, {
					...state.ruleForm,
					leaderId: state.ruleForm.leaderId.join(','),
					leaderList: arr
				}).then(res => {
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
