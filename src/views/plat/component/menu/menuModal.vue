<template>
	<div class='menu-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>

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
import { reactive, ref } from 'vue';

	const emits = defineEmits([
		'refreshList'
	]);
	const formRef = ref();
	const state = reactive({
		isShowDialog: false,
		title: '',
		ruleForm:{
			id: ''
		},
		rules: {}
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (row: any) => {
		state.isShowDialog = true;
		state.ruleForm.id = '';
	};
	const clickConfirm = () => {

	};
	defineExpose({
		openDialog
	});
</script>

<style scoped lang='scss'>

</style>
