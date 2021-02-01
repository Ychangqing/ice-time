<template>
	<div :class="className" :style="wrapStyles">
		<span>
			<template v-for="(notice, index) in notices">
				<Notice
					:key="index"
					:id="getId(notice)"
					:type="notice.type"
					:content="notice.content"
					:icon="notice.icon"
					:prefixCls="'ant-' + (notice.prefixCls == 'message' ? notice.prefixCls : (notice.prefixCls + '-notice'))"
					:duration="notice.duration"
					:transitionName="notice.transitionName"
					:name="notice.name"
					:message="notice.message"
					:description="notice.description"
					:btn="notice.btn"
				></Notice>
			</template>
		</span>
	</div>
</template>

<script>
import Notice from './notice'
let seed = 0
const now = Date.now()
function getUuid() {
	return 'ivuNotification_' + now + '_' + seed++
}
export default {
	name: 'zmessage',
	props: {
		prefixCls: {
			type: String
		},
		styles: {
			type: Object,
			default: function() {
				return {
					top: '65px',
					left: '50%'
				}
			}
		},
		content: {
			type: String
		}
	},
	data() {
		return {
			notices: []
		}
	},
	components: {
		Notice
	},
	mounted() {},
	computed: {
		wrapStyles() {
			return Object.assign({}, this.styles)
		},
		className: function() {
			return [
				`zen-${this.prefixCls}`,
				this.prefixCls == 'notification'
					? 'ant-' + this.prefixCls + '-topRight'
					: '',
				this.prefixCls == 'notification' ? 'ant-' + this.prefixCls : ''
			]
		}
	},
	methods: {
		getId(notice) {
			return (
				(notice.prefixCls == 'message' ? 'msg-' : 'notice-') + notice.id
			)
		},
		add(notice) {
			const name = notice.name || getUuid()
			let _notice = Object.assign(
				{
					styles: {
						right: '50%'
					},
					content: '',
					duration: 2,
					name: name
				},
				notice
			)
			this.notices.push(_notice)

			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				const task = {
					by_select: _notice.id ? 'id' : 'class',
					by_val: _notice.id
						? this.getId(notice)
						: `zen-${this.prefixCls}`,
					param: _notice.content || _notice.message,
					type: 'check',
					time: '2',
					step: '校验标题'
				}
				this.$utt.addTask(task)
			}
			notice.openHandle && notice.openHandle(_notice)
		},
		close(name, type) {
			const notices = this.notices
			for (let i = 0; i < notices.length; i++) {
				if (notices[i].name === name) {
					if (type && this.$utt && this.$utt.isRunning) {
						//添加uitest日志
						const task = {
							by_select: notices[i].id ? 'id' : 'class',
							by_val: notices[i].id
								? this.getId(notices[i])
								: `zen-${this.prefixCls}`,
							param: notices[i].content || notices[i].message,
							type: 'click',
							time: '2',
							step: '关闭按钮'
						}
						this.$utt.addTask(task)
					}
					notices[i].closeHandle && notices[i].closeHandle(notices[i])
					this.notices.splice(i, 1)
					break
				}
			}
		},
		closeAll() {
			this.notices = []
		}
	}
}
</script>
<style lang=less>
</style>
