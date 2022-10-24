<template>
	<div class='dept-tree-container'>
		<el-tree
			ref='deptTreeRef'
			:data="state.treeData"
			:props="{
				label: 'title',
			}"
			node-key='key'
			highlight-current
			@node-click="clickNode" />
	</div>
</template>

<script lang='ts' setup>
import { deptListApi } from '/@/api/plat/dept';
import { getAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { nextTick, onMounted, reactive, ref } from 'vue';


const emits = defineEmits([
	'clickNode'
]);
const deptTreeRef = ref();
const state = reactive({
	treeData: [] as any
});
const getDeptList = () => {
	getAction(deptListApi, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.treeData = res.datas;
			nextTick(() => {
				deptTreeRef.value.setCurrentKey(state.treeData[0].key);
				clickNode(state.treeData[0]);
			})
		}
	})
}
const clickNode = data => {
	emits('clickNode', data);
}

onMounted(() => {
	getDeptList();
})

</script>

<style scoped lang='scss'>
	.dept-tree-container{
		width: 240px;
	}
</style>
