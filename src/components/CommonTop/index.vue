<template>
	<div class='common-top-container mb15'>
		<div class='search-top-title'>
			<div class='search-top-title-left'>
				<el-button size="default" type="primary" @click='clickAdd' v-if='props.buttonAuth.includes("addBtn")'>
					<el-icon>
						<ele-Plus />
					</el-icon>
					新增
				</el-button>
				<el-popconfirm title="确定删除所选数据吗？" @confirm='clickBatchDelete' v-if='props.buttonAuth.includes("deleteBtn")'>
					<template #reference>
						<el-button size="default" type="default" class="ml10">
							<el-icon>
								<ele-Delete />
							</el-icon>
							删除
						</el-button>
					</template>
				</el-popconfirm>
				<el-button size='default' type='default' @click='clickImport' v-if='props.buttonAuth.includes("importBtn")'>
					<el-icon>
						<ele-Download />
					</el-icon>
					导入
				</el-button>
				<el-dropdown v-if='props.buttonAuth.includes("exportBtn")'>
					<el-button size='default' type='default' class='ml10'>
						<el-icon>
							<ele-Upload />
						</el-icon>
						导出
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click='exportPage(1)'>导出选中</el-dropdown-item>
							<el-dropdown-item @click='exportPage(3)'>导出全部</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<slot name='left'></slot>
			</div>
			<div class='search-top-title-right'>
				<slot name='right'></slot>
				<el-button size="default" type="primary" class="ml10" @click='clickSearch()' v-if='props.buttonAuth.includes("searchBtn")'>
					查询
				</el-button>
				<el-button size="default" type="default" class="ml10" @click='clickReset()' v-if='props.buttonAuth.includes("resetBtn")'>
					重置
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang='ts' setup>
const props = defineProps({
	buttonAuth: {
		type: Array,
		default: () => [
			'addBtn', 'deleteBtn', 'searchBtn', 'resetBtn'
		]
	}
});

const emits = defineEmits([
	'clickSearch', 'clickReset', 'clickBatchDelete', 'clickAdd',
	'clickImport', 'exportPage'
]);

const clickSearch = () => {
	emits('clickSearch');
};
const clickReset = () => {
	emits('clickReset');
};
const clickBatchDelete = () => {
	emits('clickBatchDelete')
};
const clickAdd = () => {
	emits('clickAdd');
};
const clickImport = () => {
	emits('clickImport');
};
const exportPage = (mode: number) => {
	emits('exportPage', mode);
};
</script>

<style scoped lang='scss'>
.common-top-container{
	.search-top-title{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		&-left{
			display: flex;
			justify-content: flex-start;
		}
		&-right{
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
