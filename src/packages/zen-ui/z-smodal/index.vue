<template>
	<a-modal v-model="modalVisible" @cancel="handleCancel" @ok="handleOk" :title="title">
		<zform v-if="modalVisible" ref="zform" :formConfig="formConfig" :formData="{}"></zform>

		<slot></slot>
		<slot name="footer" slot="footer">
			<a-button @click="handleCancel">Cancel</a-button>
			<a-button type="primary" @click="handleOk">OK</a-button>
		</slot>
	</a-modal>
</template>

<script>
import zform from '../zform/index.vue'
var cloneDeep = require('lodash.clonedeep')
export default {
	name: 'z-smodal',
	components: {
		zform
	},
	props: {
		title: {
			type: String
		},
		visible: {
			type: Boolean,
			default: false
		},
		columns: {}
	},
	watch: {
		visible: function(newValue) {
			this.modalVisible = newValue
		}
	},
	data() {
		return {
			formConfig: {},
			modalVisible: this.visible,
			checkboxGroupProps: 'checkboxGroup-' + new Date().getTime()
		}
	},
	mounted() {
		this.initFormConfig()
	},
	methods: {
		initFormConfig() {
			this.formConfig = {
				col: 24,
				validateFirst: true //当某一规则校验不通过时，是否停止剩下的规则的校验
			}
			const columns = cloneDeep(this.columns)
			const checkboxGroup = {
				type: 'checkboxGroup',
				props: this.checkboxGroupProps,
				subCol: 8,
				marginBottom: 8,
				options: [],
				list: [],
				disabled: []
			}
			columns.forEach(item => {
				checkboxGroup.options.push({
					label: item.title,
					value: item.props
				})
				if (!item.isHidden) {
					checkboxGroup.list.push(item.props)
				}
				if (item.disabledChecked) {
					checkboxGroup.disabled.push(item.props)
				}
			})
			this.formConfig = Object.assign({}, this.formConfig, {
				columns: [checkboxGroup]
			})
		},
		handleOk(e) {
			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				let task = {}
				task.by_select = 'id'
				task.by_val = this.idOk
				task.param = this.textOK
				task.type = 'click'
				task.time = '0'
				task.step = '点击确定按钮'
				this.$utt.addTask(task)
			}
			const optionsValue = []
			this.formConfig.columns.forEach(item => {
				if (item.checked) {
					optionsValue.push(item.props)
				}
			})
			this.$refs.zform.form.validateFieldsAndScroll(
				{ firstFields: true },
				(err, values) => {
					if (err) {
						console.log(err)
						return
					}
					for (let item of this.formConfig.columns) {
						if (item.type !== 'todo-list') {
							continue
						}
						let todoListFiled = []
						values[item.props].forEach((value, index) => {
							let subPropsObj = {}
							for (let subItem of item.subProps) {
								subPropsObj[subItem.props] =
									values[subItem.props][value]
							}
							todoListFiled[index] = subPropsObj
						})
						values[item.props] = todoListFiled
					}
					this.$emit('handleOk', values[this.checkboxGroupProps], e)
				}
			)
		},
		handleCancel(e) {
			this.modalVisible = false
			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				let task = {}
				task.type = 'click'
				task.time = '0'
				task.result = 'success'
				if (['svg', 'path', 'i'].includes(e.target.localName)) {
					task.by_select = 'class'
					task.by_val = 'ant-modal-close-icon'
					task.param = ''
					task.step = '点击关闭icon'
					this.$utt.addTask(task)
				} else if (e.target.localName === 'button') {
					task.by_select = 'id'
					task.by_val = this.cancelId
					task.param = this.textCancel
					task.step = '点击cancel按钮'
					this.$utt.addTask(task)
				}
			}
			this.initFormConfig()
			this.$emit('handleCancel', e)
		}
	}
}
</script>
<style lang=less>
@import './style/index.less';
</style>
