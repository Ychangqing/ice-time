<template>
	<a-modal
		v-model="modalVisible"
		@cancel="handleCancel"
		@ok="handleOk"
		:title="title"
		:width="width"
		:bodyStyle="bodyStyle"
		:centered="centered"
		:closable="closable"
		:confirmLoading="confirmLoading"
		:destroyOnClose="destroyOnClose"
		:keyboard="keyboard"
		:mask="mask"
		:maskClosable="maskClosable"
		:maskStyle="maskStyle"
		:okButtonProps="okButtonProps"
		:cancelButtonProps="cancelButtonProps"
		:zIndex="zIndex"
		:formConfig="formConfig"
		:formData="formData"
	>
		<slot name="title" slot="title"></slot>
		<zform v-if="isShowZForm" ref="zmodalForm" :formConfig="formConfig" :formData="formData"></zform>
		<slot></slot>
		<slot name="footer" slot="footer">
			<a-button :id="idCancel" key="back" @click="handleCancel">{{textCancel}}</a-button>
			<a-button :id="idOk" :key="okType" type="primary" @click="handleOk">{{textOK}}</a-button>
		</slot>
	</a-modal>
</template>

<script>
export default {
	name: 'zmodal',
	props: {
		title: {
			type: String
		},
		width: {
			type: [String, Number]
		},
		wrapClassName: {
			type: String
		},
		bodyStyle: {
			type: Object
		},
		cancelText: {
			type: String
		},
		keys: {
			type: String
		},
		okText: {
			type: String
		},
		okType: {
			type: String
		},
		centered: {
			type: Boolean
		},
		closable: {
			type: Boolean,
			default: true
		},
		confirmLoading: {
			type: Boolean
		},
		destroyOnClose: {
			type: Boolean,
			default: true
		},
		keyboard: {
			type: Boolean,
			default: true
		},
		mask: {
			type: Boolean,
			default: true
		},
		maskClosable: {
			type: Boolean
		},
		maskStyle: {
			type: Object
		},
		okButtonProps: {
			type: Object
		},
		cancelButtonProps: {
			type: Object
		},
		zIndex: {
			type: Number
		},
		visible: {
			type: Boolean,
			default: false
		},
		formConfig: {
			type: Object
		},
		formData: {
			type: Object,
			default: function() {
				return {}
			}
		}
	},
	data() {
		return {
			modalVisible: this.visible
		}
	},
	computed: {
		idCancel: function() {
			return this.keys ? `${this.keys}-cancel` : 'ant-modal-cancel'
		},
		idOk: function() {
			return this.keys ? `${this.keys}-ok` : 'ant-modal-ok'
		},
		textCancel: function() {
			return this.cancelText || 'Cancel'
		},
		textOK: function() {
			return this.okText || 'OK'
		},
		isShowZForm: function() {
			if (!this.formConfig || Object.keys(this.formConfig).length === 0) {
				return false
			}
			return true
		}
	},
	mounted() {
		this.prepareFormConfig()
	},
	methods: {
		prepareFormConfig() {
			if (!this.isShowZForm) {
				return
			}
			if (
				Object.keys(this.formConfig).length === 1 &&
				this.formConfig['columns']
			) {
				Object.assign(this.formConfig, {
					formLayout: 'horizontal',
					col: 12,
					btnsPlacement: 'center',
					btnsCol: 24,
					validateFirst: true
				})
			}
		},
		showModal() {
			this.modalVisible = true
			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				let task = {}
				task.by_select = 'class'
				task.by_val = this.wrapClassName || 'ant-modal'
				task.param = this.title
				task.type = 'check'
				task.time = '0'
				task.step = '校验标题'
				this.$utt.addTask(task)
			}
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
			if (!this.isShowZForm) {
				this.$emit('handleOk', e)
				return
			}

			this.$refs.zmodalForm.form.validateFieldsAndScroll(
				{ firstFields: true },
				(err, values) => {
					if (err) {
						console.log(err)
						return
					}
					this.modalVisible = false
					this.$emit('handleOk', e, values)
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
			this.$emit('handleCancel', e)
		}
	},
	watch: {
		visible: function() {
			this.modalVisible = this.visible
		},
		formConfig: {
			handler(newValue, oldValue) {
				this.prepareFormConfig()
			},
			deep: true
		}
	}
}
</script>
<style lang=less>
@import './style/index.less';
</style>
