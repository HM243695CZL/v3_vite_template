<template>
	<div class='semester-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='学年' prop='schoolYear'>
					<el-select class='w100' filterable placeholder='请选择学年' v-model='state.ruleForm.schoolYear'>
						<el-option v-for='item of props.schoolYearList' :key='item.value' :label='item.text' :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='学期' prop='semester'>
					<el-select class='w100' placeholder='请选择学期' v-model='state.ruleForm.semester'>
						<el-option v-for='(val, key) of semesterList' :key='key' :label='val' :value='key'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='选择日期' prop='dateRange'>
					<el-date-picker
						v-model="state.ruleForm.dateRange"
						type="daterange"
						range-separator="~"
						value-format='YYYY-MM-DD'
						start-placeholder="开始日期"
						end-placeholder="结束日期" />
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
import { createSemesterApi, updateSemesterApi } from '/@/api/plat/semester';
import { StatusEnum } from '/@/enum/status.enum';
import { postAction } from '/@/api/common';
import { ElMessage } from 'element-plus';

const props = defineProps({
		schoolYearList: {
			type: Array,
			required: true
		},
		semesterList: {
			type: Object,
			required: true
		}
	});
	const emits = defineEmits([
		'refreshList'
	]);
	const formRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm: {
			id: '',
			schoolYear: '',
			semester: '',
			dateRange: [] as any
		},
		rules: {
			schoolYear: [
				{ required: true, message: '学年不能为空', trigger: 'change' }
			],
			semester: [
				{ required: true, message: '学期不能为空', trigger: 'change' }
			],
			dateRange: [
				{ required: true, message: '选择日期', trigger: 'change' }
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
				state.title = '修改学期设置';
				const { id, beginTime, endTime, schoolYear, semester } = row;
				state.ruleForm.id = id;
				state.ruleForm.schoolYear = schoolYear;
				state.ruleForm.semester = semester + '';
				state.ruleForm.dateRange = [beginTime, endTime];
			} else {
				state.title = '新增学期设置';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateSemesterApi : createSemesterApi, {
					id: state.ruleForm.id,
					beginTime: state.ruleForm.dateRange[0],
					endTime: state.ruleForm.dateRange[1],
					schoolYear: state.ruleForm.schoolYear,
					semester: state.ruleForm.semester
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
