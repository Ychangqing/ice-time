<template>
	<a
		:class="className"
		:style="{fontSize: fontSize, color: color}"
		href="javascript:void(0)"
		@click.stop="jumpTo()"
	>
		<slot></slot>
	</a>
</template>

<script>
export default {
	name: 'zlink',
	props: {
		className: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		},
		fontSize: {
			type: String,
			default: ''
		}
	},
	methods: {
		jumpTo(e) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				let task = {}
				task.by_select = `id`
				task.by_val = `${e.target.id}`
				task.param = ''
				task.type = 'click'
				task.time = '0'
				task.step = '点击跳转连接'
				this.$utt.addTask(task)
			}
			this.$emit('jumpTo')
		}
	}
}
</script>

<style lang="less" scoped>
</style>
