<template>
	<div class='class-manage-container h100'>
		<div class='content-container h100'>
			<div class='tree-box h100'>
				<div class='title'>学院/专业管理</div>
				<DeptTree @clickNode='clickNode' />
			</div>
			<div class='class-manage-box h100'>
				班级管理
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import DeptTree from '/@/components/DeptTree/index.vue';

export default defineComponent({
	name: 'class-manage',
	components: {
		DeptTree
	},
	setup() {
		const clickNode = node => {
			console.log(node);
		};
		return {
			clickNode
		}
	}
});
</script>

<style scoped lang='scss'>
	.class-manage-container{
		padding: 20px;
		overflow: auto;
		.content-container{
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.tree-box{
				padding-right: 15px;
				overflow-y: scroll;
				.title{
					font-weight: 700;
					margin-bottom: 15px;
				}
			}
			.class-manage-box{
				flex: 1;
				padding-left: 15px;
			}
		}
	}
</style>
