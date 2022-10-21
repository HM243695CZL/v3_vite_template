<template>
	<div class='common-top-container mb15'>
		<div class='search-top-title'>
			<div class='search-top-title-left'>
				<el-button size="default" type="primary" @click='clickAdd'>
					<el-icon>
						<ele-Plus />
					</el-icon>
					新增
				</el-button>
				<el-popconfirm title="确定删除所选数据吗？" @confirm='clickBatchDelete'>
					<template #reference>
						<el-button size="default" type="default" class="ml10">
							<el-icon>
								<ele-Delete />
							</el-icon>
							删除
						</el-button>
					</template>
				</el-popconfirm>
				<slot name='left'></slot>
			</div>
			<div class='search-top-title-right'>
				<slot name='right'></slot>
				<el-button size="default" type="primary" class="ml10" @click='clickSearch()'>
					查询
				</el-button>
				<el-button size="default" type="default" class="ml10" @click='clickReset()'>
					重置
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang='ts' setup>

const emits = defineEmits([
	'clickSearch', 'clickReset', 'clickBatchDelete', 'clickAdd'
]);

const clickSearch = () => {
	emits('clickSearch');
};
const clickReset = () => {
	emits('clickReset')
};
const clickBatchDelete = () => {
	emits('clickBatchDelete')
};
const clickAdd = () => {
	emits('clickAdd')
};
</script>

<style scoped lang='scss'>
.common-top-container{
	.search-top-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-left{
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		&-right{
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
