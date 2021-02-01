<template>
	<a-icon
		v-if="iconType"
		:type="iconType"
		:spin="spin"
		:theme="theme"
		:class="className"
		:style="{fontSize: fontSize, color: fontColor}"
	/>
</template>

<script>
export default {
	name: 'zicon',
	props: {
		iconType: {
			type: String,
			default: ''
		},
		spin: {
			type: Boolean,
			default: false
		},
		theme: {
			type: String,
			default: 'outlined'
		},
		className: {
			type: String
		},
		fontSize: String,
		fontColor: String
	}
}
</script>

<style lang="less" scoped>
</style>
