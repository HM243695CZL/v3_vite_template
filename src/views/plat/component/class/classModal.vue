<template>
	<div class='class-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='校区' prop='xqmc'>
					<el-select class='w100' filterable placeholder='请选择校区' v-model='state.ruleForm.xqmc' @change='changeXqmc'>
						<el-option v-for='item in schoolAreaList' :key='item.id' :label='item.keyCode' :value='item.keyCode'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='部门' prop='collageId'>
					<el-tree-select v-model='state.ruleForm.collageId'
													:data='deptList'
													:check-strictly='true'
													placeholder='请选择部门'
													filterable
													class='w100'
													@change='changeCollege'
													:props='{
																label: "title",
																value: "key"
															}' />
				</el-form-item>
				<el-form-item label='专业' prop='majorId'>
					<el-select class='w100' filterable placeholder='请选择专业' v-model='state.ruleForm.majorId'>
						<el-option v-for='item of state.majorList' :key='item.value' :label='item.text' :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='年级' prop='schoolYear'>
					<el-select class='w100' filterable placeholder='请选择年级' v-model='state.ruleForm.schoolYear'>
						<el-option v-for='item of state.yearList' :key='item' :label='item' :value='item'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='班级名称' prop='name'>
					<el-input v-model='state.ruleForm.name' placeholder='请输入班级名称'></el-input>
				</el-form-item>
				<el-form-item label='班主任' prop='headTeacherId'>
					<el-select class='w100' filterable placeholder='请选择班主任' v-model='state.ruleForm.headTeacherId'>
						<el-option v-for='item of teacherList' :key='item.id' :label='item.name' :value='item.id'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='班长' prop='monitor'>
					<el-input v-model='state.ruleForm.monitor' placeholder='请输入班长'></el-input>
				</el-form-item>
				<el-form-item label='班长联系电话' prop='telphone'>
					<el-input v-model='state.ruleForm.telphone' placeholder='请输入班长联系电话'></el-input>
				</el-form-item>
				<el-form-item label='备注' prop='remark'>
					<el-input v-model='state.ruleForm.remark' placeholder='请输入备注'></el-input>
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
import { getMajorListApi } from '/@/api/plat/college';
import {
	createClassApi, updateClassApi
} from '/@/api/plat/class';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { ElMessage } from 'element-plus';

const props = defineProps({
		schoolAreaList: {
			type: Array,
			required: true
		},
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
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm: {
			id: '',
			xqmc: '',
			xqhId: '',
			collageId: '',
			majorId: '',
			schoolYear: '',
			name: '',
			headTeacherId: '',
			monitor: '',
			telphone: '',
			remark: ''
		},
		rules: {
			xqmc: [
				{ required: true, message: '请选择校区', trigger: 'change' }
			],
			collageId: [
				{ required: true, message: '请选择部门', trigger: 'change' }
			],
			majorId: [
				{ required: true, message: '请选择专业', trigger: 'change' }
			],
			schoolYear: [
				{ required: true, message: '请选择年级', trigger: 'change' }
			],
			name: [
				{ required: true, message: '请输入班级名称', trigger: 'blur' }
			],
			headTeacherId: [
				{ required: true, message: '请选择班主任', trigger: 'blur' }
			]
		},
		majorList: [] as any,
		yearList: [] as any
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		state.majorList = [];
		let currentYear = new Date().getFullYear();
		for (let i = 0; i <= 4; i ++) {
			state.yearList.unshift(currentYear --);
		}
		nextTick(() => {
			formRef.value.resetFields();
			if (row) {
				state.title = '修改班级';
				state.ruleForm = row;
				changeCollege(row.collageId);
			} else {
				state.title = '新增班级';
			}
		})
	}
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateClassApi : createClassApi, state.ruleForm).then(res => {
					if (res.status === StatusEnum.SUCCESS) {
						ElMessage.success(res.message);
						closeDialog();
						emits('refreshList');
					}
				})
			}
		})
	};
	const changeXqmc = (xqmc: string) => {
		props.schoolAreaList.map((item: any) => {
			if (item.keyCode === xqmc) {
				state.ruleForm.xqhId = item.keyValue;
			}
		})
	};
	const changeCollege = (collegeId: string) => {
		postAction(getMajorListApi, [collegeId]).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.majorList = [];
				if (res.datas.length === 0) {
					ElMessage.error('该部门下暂无专业');
					state.ruleForm.majorId = '';
					return false;
				}
				state.majorList = res.datas;
			}
		})
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
