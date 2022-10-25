<template>
	<div class='import-file-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='800px'>
			<div class='row'>
				1.下载导入模板 <span class='download' @click='downloadTemp'>点击下载</span>
			</div>
			<div class='row'>
				2.按条件填写信息
				<vxe-table :data='state.dataList'>
					<vxe-column field='schoolArea' title='校区' />
					<vxe-column field='college' title='学院' />
					<vxe-column field='major' title='专业' />
					<vxe-column field='schoolYear' title='年级' />
					<vxe-column field='className' title='班级名称' />
					<vxe-column field='monitor' title='班长' />
					<vxe-column field='tel' title='班长联系电话' />
				</vxe-table>
			</div>
			<div class='row down-btn'>
				3.上传填好的文档
				<el-upload
					class="upload-demo"
					:data='{moduleName: "classes"}'
					:show-file-list='false'
					list-type="picture"
					accept='.xls,.xlsx'
					:auto-upload='false'
				>
					<span class='download'>点击上传</span>
				</el-upload>
			</div>
			<div class='row'>
				4.点击确定按钮导入文档
			</div>
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
	import { reactive } from 'vue';
	import { downloadClassTempApi } from '/@/api/plat/class';
	const baseUrl = import.meta.env.VITE_API_URL as any;

	const state = reactive({
		isShowDialog: false,
		title: '班级信息导入',
		dataList: [{
			schoolArea: '必填',
			college: '必填',
			major: '必填',
			schoolYear: '必填',
			className: '必填',
			monitor: '选填',
			tel: '选填'
		}]
	});
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = () => {
		state.isShowDialog = true;
	};
	const downloadTemp = () => {
		window.location.href = `${baseUrl}${downloadClassTempApi}`;
	};
	const clickConfirm = () => {

	};
	defineExpose({
		openDialog
	})
</script>

<style scoped lang='scss'>
	.import-file-modal-container{
		.row{
			margin-bottom: 10px;
		}
		.down-btn{
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.download{
			margin-left: 10px;
			cursor: pointer;
			color: #007CE9;
		}
	}
</style>
