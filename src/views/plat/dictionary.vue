<template>
	<div class='dictionary-container h100' ref='dictionaryRef'>
		<CommonTop
			@clickAdd='clickAdd'
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			@clickBatchDelete='clickBatchDelete'>
			<template #right>
				<el-form-item label='标签'>
					<el-input placeholder='请输入标签' v-model='searchParams.type'></el-input>
				</el-form-item>
				<el-form-item label='描述'>
					<el-input placeholder='请输入描述' v-model='searchParams.description'></el-input>
				</el-form-item>
			</template>
		</CommonTop>
		<vxe-table
			ref='tableRef'
			:row-config='{
				useKey: true,
				keyField: "id"
			}'
			:data='dataList'
			:max-height='tableHeight - otherHeight'
			@checkbox-all='selectionChange'
			@checkbox-change='selectionChange'
		>
			<vxe-column type='checkbox' width='60' />
			<vxe-column field='keyCode' title='键码' />
			<vxe-column field='keyValue' title='键值' />
			<vxe-column field='type' title='标签' />
			<vxe-column field='description' title='描述' />
			<vxe-column field='orderLevel' title='排序' :title-help='{message: "值越小，排序越高"}'/>
			<vxe-column title='操作' width='240'>
				<template #default='scope'>
					<el-button size='small' type='primary' @click='clickEdit(scope.row)'>编辑</el-button>
					<el-button size='small' type='primary' @click='clickAddKey(scope.row)'>添加键值</el-button>
					<el-button size='small' type='danger' @click='clickDelete(scope.row.id)'>删除</el-button>
				</template>
			</vxe-column>
		</vxe-table>
		<el-pagination
			@size-change="changePageSize"
			@current-change="changePageIndex"
			class="mt15"
			:pager-count="5"
			:page-sizes="[10, 20, 30]"
			v-model:current-page="pageInfo.first"
			background
			v-model:page-size="pageInfo.rows"
			layout="total, sizes, prev, pager, next, jumper"
			:total="pageInfo.totalRecords"
		/>
		<DictionaryModal
			ref='modalFormRef'
			@refreshList='getDataList'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import { dictPageApi, deleteDictApi } from '/@/api/plat/dictionary';
import useCrud from '/@/hooks/useCrud';
import DictionaryModal from './component/dictionary/dictionaryModal.vue';
import _ from 'lodash';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/enum/status.enum';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'dictionary',
	components: {
		CommonTop,
		DictionaryModal
	},
	setup() {
		const dictionaryRef = ref();
		const state = reactive({
			uris: {
				page: dictPageApi,
				delete: deleteDictApi,
				deleteBatch: deleteDictApi
			},
			otherHeight: 156,
		});
		const {
			clickAdd,
			clickEdit,
			getDataList,
			changePageIndex,
			changePageSize,
			selectionChange,
			clickSearch,
			clickReset,
			clickBatchDelete,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: dictionaryRef
		});
		const clickAddKey = (row: any) => {
			modalFormRef.value.openDialog(_.cloneDeep(row), true)
		};
		const clickDelete = (id: string) => {
			postAction(state.uris.delete, [id]).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					getDataList();
				}
			})
		}
		return {
			dictionaryRef,
			clickDelete,
			clickAddKey,
			...toRefs(state),

			clickAdd,
			clickEdit,
			getDataList,
			changePageIndex,
			changePageSize,
			selectionChange,
			clickSearch,
			clickReset,
			clickBatchDelete,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		}
	}
});
</script>

<style scoped lang='scss'>
	.dictionary-container{
		padding: 20px;
		overflow: auto;
	}
</style>
