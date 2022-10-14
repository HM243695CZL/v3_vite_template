<template>
	<div class='dynamic-test-container'>
		<el-input v-model='testValue' size="default" style="max-width: 180px"> </el-input>
		<el-button @click="goPath('1')">跳转</el-button>
		<el-button @click="goPath('2')">跳转</el-button>
	</div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'dynamicTest',
	setup() {
		const state = reactive({
			testValue: ''
		});
		const router = useRouter();
		const goPath = (value: string) => {
			router.push('/system/dynamic/' + value)
		}
		return {
			...toRefs(state),
			goPath
		}
	}
});
</script>

<style scoped lang='scss'>

</style>