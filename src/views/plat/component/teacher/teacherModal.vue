<template>
	<div class='teacher-modal-container'>
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
						<el-form-item label='工号' prop='number'>
							<el-input v-model='state.ruleForm.number' placeholder='请输入工号'></el-input>
						</el-form-item>
						<el-form-item label='部门' prop='orgId'>
							<el-tree-select v-model='state.ruleForm.orgId'
															:data='deptList'
															:check-strictly='true'
															placeholder='请选择部门'
															filterable
															class='w100'
															:props='{
																label: "title",
																value: "key"
															}' />
						</el-form-item>
						<el-form-item label='职务' prop='position'>
							<el-select class='w100' filterable placeholder='请选择职务' v-model='state.ruleForm.position'>
								<el-option v-for='item in positionList' :key='item.id' :label='item.label' :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='职称' prop='title'>
							<el-select class='w100' filterable placeholder='请选择职称' v-model='state.ruleForm.title'>
								<el-option v-for='item in titleList' :key='item.id' :label='item.label' :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='岗位类型' prop='type'>
							<el-select class='w100' filterable placeholder='请选择岗位类型' v-model='state.ruleForm.type'>
								<el-option v-for='(val, key) in typeList' :key='key' :label='val' :value='key'></el-option>
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
								module-name='teacher'
								btn-text='更换头像'
								:show-file-list='false'
								:source='state.source'
							/>
						</div>
						<el-form-item label='任职类型' prop='workType'>
							<el-select class='w100' filterable placeholder='请选择任职类型' v-model='state.ruleForm.workType'>
								<el-option v-for='item in workTypeList' :key='item.id' :label='item.label' :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='性别' prop='sex'>
							<el-select class='w100' filterable placeholder='请选择性别' v-model='state.ruleForm.sex'>
								<el-option v-for='(val, key) in sexList' :key='key' :label='val' :value='key'></el-option>
							</el-select>
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
	import { StatusEnum } from '/@/enum/status.enum';
	import { createTeacherApi, updateTeacherApi } from '/@/api/plat/teacher';
	import { postAction, reviewFileUrl } from '/@/api/common';
	import userAvatar from '/@/assets/user/photo0.png';
	import { ElMessage } from 'element-plus';
	import SingleUpload from '/@/components/Upload/SingleUpload.vue';
	const props = defineProps({
		deptList: {
			type: Array,
			required: true
		},
		positionList: {
			type: Array,
			required: true
		},
		titleList: {
			type: Array,
			required: true
		},
		typeList: {
			type: Object,
			required: true
		},
		workTypeList: {
			type: Array,
			required: true
		},
		sexList: {
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
		avatarImg: userAvatar,
		ruleForm: {
			id: '',
			name: '',
			number: '',
			orgId: '',
			position: '',
			title: '',
			type: '' ,
			telphone: '',
			photo: '',
			workType: '',
			sex: '',
			email: ''
		},
		rules: {
			name: [
				{ required: true, message: '姓名不能为空', trigger: 'blur' }
			],
			number: [
				{ required: true, message: '工号不能为空', trigger: 'blur' }
			],
			orgId: [
				{ required: true, message: '部门不能为空', trigger: 'change' }
			],
			position: [
				{ required: true, message: '职务不能为空', trigger: 'change' }
			],
			title: [
				{ required: true, message: '职称不能为空', trigger: 'change' }
			],
			type: [
				{ required: true, message: '岗位类型不能为空', trigger: 'change' }
			],
			workType: [
				{ required: true, message: '任职类型不能为空', trigger: 'change' }
			]
		},
		source: {} as any
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
		state.avatarImg = userAvatar;
		state.source = {};
		nextTick(() => {
			formRef.value.resetFields();
			if (row) {
				state.title = '修改教师';
				state.ruleForm = row;
				state.ruleForm.type = row.type + '';
				state.ruleForm.sex = row.sex + '';
				if (row.photo) {
					state.source = row.photoSource;
					state.avatarImg = `${reviewFileUrl}${row.photoSource.moduleName}/${row.photoSource.fileNewName}`;
				}
			} else {
				state.title = '新增教师';
			}
		});

	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateTeacherApi : createTeacherApi, state.ruleForm).then(res => {
					if (res.status === StatusEnum.SUCCESS) {
						ElMessage.success(res.message);
						closeDialog();
						emits('refreshList');
					}
				})
			}
		})
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
