<template>
	<div class='student-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-row :gutter='20'>
					<el-col :span='12'>
						<el-form-item label='姓名' prop='name'>
							<el-input v-model='state.ruleForm.name' placeholder='请输入姓名'></el-input>
						</el-form-item>
						<el-form-item label='学号' prop='number'>
							<el-input v-model='state.ruleForm.number' placeholder='请输入学号'></el-input>
						</el-form-item>
						<el-form-item label='校区' prop='xqmc'>
							<el-select class='w100' filterable placeholder='请选择校区' v-model='state.ruleForm.xqmc' @change='changeXqmc'>
								<el-option v-for='item of props.schoolAreaList' :key='item.id' :label='item.keyCode' :value='item.keyCode'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='部门' prop='collegeId'>
							<el-tree-select v-model='state.ruleForm.collegeId'
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
							<el-select class='w100' filterable placeholder='请选择专业' v-model='state.ruleForm.majorId' @change='changeMajor'>
								<el-option v-for='item of state.majorList' :key='item.value' :label='item.text' :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='班级' prop='classId'>
							<el-select class='w100' filterable placeholder='请选择班级' v-model='state.ruleForm.classId'>
								<el-option v-for='item of state.classList' :key='item.value' :label='item.text' :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='入校日期' prop='schoolTime'>
							<el-date-picker
								v-model="state.ruleForm.schoolTime"
								type="date"
								class='w100'
								placeholder="请选择入校日期"
							/>
						</el-form-item>
						<el-form-item label='性别' prop='sex'>
							<el-select class='w100' filterable placeholder='请选择性别' v-model='state.ruleForm.sex'>
								<el-option v-for='(val, key) in sexList' :key='key' :label='val' :value='key'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='电话' prop='telphone'>
							<el-input placeholder='请输入电话' v-model='state.ruleForm.telphone'></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<div class='avatar-box'>
							<img class='avatar-img' :src='state.avatarImg' alt=''>
							<SingleUpload
								@uploadSuccess='handleSuccess'
								accept-file='.png,.jpg,.jpeg,.bmg,.gif'
								module-name='student'
								btn-text='更换头像'
								:show-file-list='false'
								:source='state.source'
							/>
						</div>
						<el-form-item label='学生类型' prop='type'>
							<el-select class='w100' filterable placeholder='请选择学生类型' v-model='state.ruleForm.type'>
								<el-option v-for='item of props.studentTypeList' :key='item.id' :label='item.keyCode' :value='item.keyValue'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='身份证号' prop='idcard'>
							<el-input v-model='state.ruleForm.idcard' placeholder='请输入身份证号'></el-input>
						</el-form-item>
						<el-form-item label='邮箱' prop='email'>
							<el-input v-model='state.ruleForm.email' placeholder='请输入邮箱'></el-input>
						</el-form-item>
					</el-col>
				</el-row>
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
	import userAvatar from '/@/assets/user/photo0.png';
	import { postAction, reviewFileUrl } from '/@/api/common';
	import { getMajorListApi } from '/@/api/plat/college';
	import { getClassListApi } from '/@/api/plat/class';
	import { createStudentApi, updateStudentApi } from '/@/api/plat/student';
	import { StatusEnum } from '/@/enum/status.enum';
	import { ElMessage } from 'element-plus';
	import SingleUpload from '/@/components/Upload/SingleUpload.vue';
	import { verifyElFormIdCard } from '/@/utils/toolsValidate';

	const props = defineProps({
		schoolAreaList: {
			type: Array,
			required: true
		},
		deptList: {
			type: Array,
			required: true
		},
		sexList: {
			type: Object,
			required: true
		},
		studentTypeList: {
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
		avatarImg: userAvatar,
		ruleForm: {
			id: '',
			name: '',
			number: '',
			xqmc: '',
			xqhId: '',
			collegeId: '',
			majorId: '',
			classId: '',
			schoolTime: '',
			sex: '',
			telphone: '',
			photo: '',
			type: '',
			idcard: '',
			email: ''
		},
		rules: {
			name: [
				{ required: true, message: '姓名不能为空', trigger: 'blur' }
			],
			number: [
				{ required: true, message: '学号不能为空', trigger: 'blur' }
			],
			xqmc: [
				{ required: true, message: '校区不能为空', trigger: 'change' }
			],
			collegeId: [
				{ required: true, message: '部门不能为空', trigger: 'change' }
			],
			majorId: [
				{ required: true, message: '专业不能为空', trigger: 'change'}
			],
			classId: [
				{ required: true, message: '班级不能为空', trigger: 'change' }
			],
			sex: [
				{ required: true, message: '性别不能为空', trigger: 'change' }
			],
			idcard: [
				{ validator: verifyElFormIdCard, message: '身份证号格式不正确', trigger: 'blur'}
			]
		},
		majorList: [] as any,
		classList: [] as any,
		source: {} as any
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		state.avatarImg = userAvatar;
		state.majorList = [];
		nextTick(() => {
			formRef.value.resetFields();
			if (row) {
				state.title = '修改学生';
				state.ruleForm = row;
				state.ruleForm.sex = row.sex + '';
				state.ruleForm.type = row.type && ~~row.type;
				changeCollege(row.collegeId);
				changeMajor(row.majorId);
			} else {
				state.title = '新增学生';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateStudentApi : createStudentApi, state.ruleForm).then(res => {
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
		});
	};
	const changeMajor = (majorId: string) => {
		postAction(getClassListApi, [majorId]).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.classList = [];
				if (res.datas.length === 0) {
					ElMessage.error('该部门下暂无班级');
					state.ruleForm.classId = '';
					return false;
				}
				state.classList = res.datas;
			}
		});
	};
	const handleSuccess = (res: any) => {
		state.source = res.datas;
		state.avatarImg = `${reviewFileUrl}${res.datas.moduleName}/${res.datas.fileNewName}`;
		state.ruleForm.photo = res.datas.id;
	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>
.avatar-box{
	text-align: center;
	margin-bottom: 15px;
	.avatar-img{
		width: 120px;
		height: 135px;
		margin-bottom: 10px;
	}
}
</style>
