<template>
	<div class='menu-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='上级菜单' prop='parentId'>
					<el-tree-select v-model='state.ruleForm.parentId'
													:data='props.menuTreeList'
													:check-strictly='true'
													node-key='key'
													placeholder='请选择上级菜单'
													filterable
													class='w100'
													ref='menuTreeRef'
													:props='{
																label: "title",
																value: "key"
															}' />
				</el-form-item>
				<el-form-item label='菜单名称' prop='name'>
					<el-input placeholder='请输入菜单名称' v-model='state.ruleForm.name'></el-input>
				</el-form-item>
				<el-form-item label='类型' prop='type'>
					<el-select class='w100' clearable placeholder='请选择类型' v-model='state.ruleForm.type'>
						<el-option v-for='item of state.typeList' :key='item.value' :label='item.text' :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='可见性' prop='status'>
					<el-radio-group v-model="state.ruleForm.status">
						<el-radio :label="1" size="large">显示</el-radio>
						<el-radio :label="0" size="large">隐藏</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label='链接' prop='url'>
					<el-input v-model='state.ruleForm.url' placeholder='请输入链接'></el-input>
				</el-form-item>
				<el-form-item label='目标' prop='targetType'>
					<el-select v-model='state.ruleForm.targetType' placeholder='请选择目标' class='w100'>
						<el-option v-for='item of state.targetList' :key='item.value' :label='item.text' :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='排序' prop='showLevel'>
					<el-input-number :min='1' v-model='state.ruleForm.showLevel' placeholder='升序、值越小、排序越高' class='w100'></el-input-number>
				</el-form-item>
				<el-form-item label='图标' prop='icon'>
					<el-input placeholder='请输入图标' v-model='state.ruleForm.icon'></el-input>
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
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { createMenuApi, updateMenuApi } from '/@/api/plat/menu';
import { ElMessage } from 'element-plus';
import { OtherUtil } from '/@/utils/other.util';

const props = defineProps({
		menuTreeList: {
			type: Array,
			required: true
		},
		rootTreeId: {
			type: String,
			required: true
		}
	});

	const emits = defineEmits([
		'refreshList'
	]);
	const formRef = ref();
	const menuTreeRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm:{
			id: '',
			parentId: '',
			name: '',
			type: null,
			status: '',
			url: '',
			targetType: '',
			showLevel: undefined,
			icon: '',
			remark: ''
		},
		rules: {
			parentId: [
				{ required: true, message: '上级菜单不能为空', trigger: 'change' }
			],
			name: [
				{ required: true, message: '菜单名称不能为空', trigger: 'blur' }
			],
			type: [
				{ required: true, message: '类型不能为空', trigger: 'change' }
			],
			url: [
				{ required: true, message: '链接不能为空', trigger: 'blur' }
			],
			showLevel: [
				{ required: true, message: '排序不能为空', trigger: 'blur' }
			]
		},
		typeList: [
			{ text: '菜单', value: 0 },
			{ text: '按钮', value: 1 },
			{ text: '其他', value: 2 },
		],
		targetList: [
			{ text: '内部系统', value: 0 },
			{ text: '新窗口打开', value: 1 },
			{ text: '第三方链接', value: 2 },
		]
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
				isSub ? state.title = '新增菜单' : '修改菜单';
				if (!isSub) {
					state.ruleForm = OtherUtil.cloneForm(state.ruleForm, row) as any;
					menuTreeRef.value.setCurrentKey(row.parentId);
				} else {
					state.ruleForm.parentId = row.id;
					menuTreeRef.value.setCurrentKey(row.id);
				}
			} else {
				state.title = '新增菜单';
			}
		})
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(state.ruleForm.id ? updateMenuApi : createMenuApi, state.ruleForm).then(res => {
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
