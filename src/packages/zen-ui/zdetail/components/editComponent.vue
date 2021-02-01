<template>
	<span>
		<a-input-group v-if="editting" compact>
			<a-input
				style="width: 60%"
				:defaultValue="defaultValue"
				onfocus="this.select()"
				:id="prefixId+'einput'"
				@blur="(e) => blurHandle(e)"
				@change="(e) => inputChange(e)"
			/>
			<a-button
				style="width: 20%;max-width: 80px;"
				type="primary"
				@click="(e)=>{btnHandle(e,'save')}"
				:id="prefixId+'esave'"
			>确定</a-button>
			<a-button
				style="width: 20%;max-width: 80px;"
				@click="(e)=>{btnHandle(e,'cancel')}"
				:id="prefixId+'ecancel'"
			>取消</a-button>
		</a-input-group>

		<template v-if="!editting">
			<zicon
				@click.native="iconClickHandle"
				:iconType="iconType"
				:theme="theme"
				:className="className"
				:fontSize="fontSize"
				:fontColor="fontColor"
				style="cursor: pointer"
				:id="prefixId+'eicon'"
			></zicon>
		</template>
	</span>
</template>

<script>
import zicon from '../../zicon/index.vue'
export default {
	props: {
		editting: {
			type: Boolean,
			default: false
		},
		defaultValue: String,
		iconType: {
			type: String,
			default: 'edit'
		},
		theme: {
			type: String,
			default: 'filled'
		},
		className: String,
		fontSize: String,
		fontColor: String,
		prefixId: String
	},
	components: {
		zicon
	},
	methods: {
		inputChange(e) {
			this.$emit('editInputChange', e.target.value)
		},
		blurHandle(e) {
			this.setTask('input', e)
		},
		iconClickHandle(e) {
			this.setTask('icon', e)
			this.$emit('startEdit')
		},
		btnHandle(e, type) {
			this.setTask(type, e)
			this.$emit(`${type}Handle`)
		},
		setTask(type, e) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				let task = {}
				task.by_select = `id`
				task.by_val = `${e.target.id}`
				task.param = ''
				task.type = 'click'
				task.time = '0'
				if (type === 'icon') {
					task.step = '点击编辑按钮'
					task.by_val = `${e.currentTarget.id}`
				} else if (type === 'input') {
					task.type = 'sendkey'
					task.param = e.target.value
					task.step = '给input元素设值'
				} else if (type === 'save') {
					task.step = '点击保存按钮'
				} else if (type === 'cancel') {
					task.step = '点击取消按钮'
				}
				this.$utt.addTask(task)
			}
		}
	}
}
</script>
