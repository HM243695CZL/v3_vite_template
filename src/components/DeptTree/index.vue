<template>
	<div class='dept-tree-container'>
		<el-tree
			ref='deptTreeRef'
			:data="props.treeData"
			:props="props.treeProps"
			node-key='id'
			highlight-current
			@node-click="clickNode" >
			<template #default='{node, data}'>
				<span class='node-label'>
					{{node.label}}
					<el-icon class='plus-icon' v-if='props.canOperate' @click.stop='clickAddNode(node, data)'>
						<ele-CirclePlus />
					</el-icon>
				</span>
			</template>
		</el-tree>
	</div>
</template>

<script lang='ts' setup>
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
	canOperate: {
		type: Boolean,
		default: false
	},
	treeData: {
		type: Array as any,
		required: true,
	},
	treeProps: {
		type: Object,
		default: () => ({
			label: 'title',
			children: 'children'
		})
	}
});
const emits = defineEmits([
	'clickNode', 'clickAddNode'
]);

const deptTreeRef = ref();

watch(props, newProps => {
	if (newProps.treeData.length > 0) {
		nextTick(() => {
			deptTreeRef.value.setCurrentKey(props.treeData[0].id);
			clickNode(props.treeData[0]);
		})
	}
});

const clickNode = data => {
	emits('clickNode', data);
};
const clickAddNode = (node, data) => {
	emits('clickAddNode', {node, data})
};

</script>

<style scoped lang='scss'>
	.dept-tree-container{
		width: 240px;
		.node-label{
			display: flex;
			align-items: center;
			&:hover{
				.plus-icon{
					display: inline-block;
				}
			}
			.plus-icon{
				margin-left: 5px;
				display: none;
			}
		}
	}
</style>
