<template>
	<div class='logs-container h100' ref='logsRef'>
		<CommonTop
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			:button-auth='["exportBtn", "searchBtn", "resetBtn"]'
		>
			<template #right>
				<el-form-item label='类型'>
					<el-input placeholder='请输入类型' v-model='searchParams.moduleName'></el-input>
				</el-form-item>
				<el-form-item label='操作'>
					<el-select clearable placeholder='请选择操作' v-model='searchParams.operationType'>
						<el-option v-for='(val, key) in operationTypeObj' :key='key' :label='val' :value='key'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='日期'>
					<el-date-picker
						v-model="searchParams.date"
						type="date"
						placeholder="请选择日期"
						format='YYYY-MM-DD'
						value-format='YYYY-MM-DD'
					/>
				</el-form-item>
				<el-form-item label='姓名'>
					<el-input placeholder='请输入姓名' v-model='searchParams.operator'></el-input>
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
		>
			<vxe-column type='seq' title='序号' />
			<vxe-column field='gmtCreate' title='日期' :formatter='formatTime' />
			<vxe-column field='operator' title='姓名' />
			<vxe-column field='moduleName' title='类型' />
			<vxe-column field='operationType' title='操作'>
				<template #default='scope'>
					{{operationTypeObj[scope.row.operationType]}}
				</template>
			</vxe-column>
			<vxe-column field='operValue' title='日志' />
			<vxe-column field='operatorIp' title='IP' />
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
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import useCrud from '/@/hooks/useCrud';
import { getLogPageApi } from '/@/api/plat/logs';
import XEUtils from 'xe-utils';
import { FilterEnum, FilterTypeEnum } from '/@/enum/filter.enum';
import dayjs from 'dayjs';

export default defineComponent({
	name: 'logs',
	components: {
		CommonTop
	},
	setup() {
		const logsRef = ref();
		const state = reactive({
			uris: {
				page: getLogPageApi
			},
			date: '',
			otherHeight: 156,
			operationTypeObj: {
				create: '新增',
				update: '编辑',
				delete: '删除',
				query: '查询',
				check: '审批',
				upload: '导入',
				download: '导出'
			},
			otherQueryType: [] as any
		});
		const formatTime = ({ cellValue }) => {
			return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
		};
		const {
			getDataList,
			changePageIndex,
			changePageSize,
			clickSearch,
			clickReset,
			pageInfo,
			dataList,
			tableRef,
			modalFormRef,
			searchParams,
			tableHeight
		} = useCrud({
			uris: state.uris,
			parentRef: logsRef,
		});
		onMounted(() => {
			state.otherQueryType = [
				{
					field: 'gmtCreate',
					matchMode: FilterEnum.BETWEEN,
					value: 'aaaaaaaaaa',
					whereType: FilterTypeEnum.AND
				}
			];
			clickSearch();
		});
		return {
			logsRef,
			formatTime,
			...toRefs(state),

			getDataList,
			changePageIndex,
			changePageSize,
			clickReset,
			clickSearch,
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
	.logs-container{
		padding: 20px;
		overflow: auto;
	}
</style>
