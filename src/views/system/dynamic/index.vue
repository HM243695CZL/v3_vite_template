<template>
	<div class='dynamic-detail-container'>
		dynamic-detail-container-hl243695czyn
		<el-input v-model='dynamicValue' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
	name: 'dynamicDetail',
	setup() {
		const state = reactive({
			dynamicValue: ''
		});
		return {
			...toRefs(state)
		}
	}
});
</script>

<style scoped lang='scss'>

</style>