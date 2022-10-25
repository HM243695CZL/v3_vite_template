<template>
	<div class='single-upload-container'>
		<el-upload
			class="upload-demo"
			:show-file-list='props.showFileList'
			:file-list='fileArr'
			list-type="picture"
			:auto-upload='false'
			:on-change='handleChange'
			:accept='props.acceptFile'
		>
			<el-button type="default">{{props.btnText}}</el-button>
		</el-upload>
	</div>
</template>

<script lang='ts' setup>
	import { StatusEnum } from '/@/enum/status.enum';
	import { ElMessage } from 'element-plus';
	import { reviewFileUrl, uploadAction, uploadUrl } from '/@/api/common';
	import { computed, reactive } from 'vue';

	const props = defineProps({
		acceptFile: {
			type: String,
			required: true
		},
		moduleName: {
			type: String,
			required: true
		},
		btnText: {
			type: String,
			default: '点击上传'
		},
		source: {
			type: Object as any,
		},
		showFileList: {
			type: Boolean,
			default: true
		}
	})
	const emits = defineEmits([
		'uploadSuccess'
	]);
	const state = reactive({
		fileList: [] as any
	});
	const fileArr = computed({
		get: () => {
			return props.source.id ? [{
				name: props.source.fileOriginalName,
				url: `${reviewFileUrl}${props.source.moduleName}/${props.source.fileNewName}`
			}] : [];
		},
		set: (params: any) => {
			state.fileList = [{
				name: params.name,
				url: params.url
			}]
		}
	});
	const handleChange = (file: any) => {
		const formData = new FormData();
		formData.append('file', file.raw);
		formData.append('moduleName', props.moduleName);
		uploadAction(uploadUrl, formData).then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				ElMessage.success(res.message);
				fileArr.value = [{
					name: res.fileOriginalName,
					url: `${reviewFileUrl}${res.moduleName}/${res.fileNewName}`
				}]
				emits('uploadSuccess', res);
			}
		})
	};
</script>

<style scoped lang='scss'>

</style>
