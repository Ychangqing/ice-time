<template>
	<!-- <transition :name="`zen-${prefixCls}`" appear> -->
	<!-- <transition name="zen-message" appear> -->
	<transition :name="transitionName" appear>
		<div class="zen-notice" :class="prefixCls == 'ant-message' ? prefixCls : ''" :id="id || null">
			<div class="zen-notice-content">
				<div
					v-if="prefixCls == 'ant-message'"
					:class="`${prefixCls}-custom-content${type ? ` ${prefixCls}-${type}` : ''}`"
				>
					<a-icon :type="icon" />
					<span v-html="content"></span>
				</div>
				<div v-else :class="icon ? `${prefixCls}-with-icon` : ''">
					<a-icon v-if="icon" :class="`${prefixCls}-icon ${prefixCls}-icon-${type}`" :type="icon" />
					<div v-if="message" :class="`${prefixCls}-message`" v-html="message"></div>
					<div v-if="description" :class="`${prefixCls}-description`" v-html="description"></div>
					<!-- <span id="notice-btns"></span>
					<span v-if="btn" :class="`${prefixCls}-btn`">{{ btnHandle(btn) }}</span>-->

					<!-- >{{ typeof btn === 'function' ? btn(h) : btn }}</span> -->
				</div>
			</div>
			<a
				v-if="prefixCls != 'ant-message' && closable"
				tabindex="0"
				@click="close('icon')"
				:class="`${prefixCls}-close`"
			>
				<span v-if="closeIcon">{{closeIcon}}</span>
				<a-icon v-else :class="`${prefixCls}-close-icon`" type="close" />
			</a>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'znotice',
	props: {
		prefixCls: {
			type: String
		},
		duration: {
			type: Number,
			default: 1.5
		},
		type: {
			type: String
		},
		icon: {
			type: String
		},
		id: {
			type: String,
			default: ''
		},
		transitionName: {
			type: String
		},
		content: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			required: true
		},
		message: {
			type: String
		},
		description: {
			type: String
		},
		btn: {
			type: [Function, String]
		},
		closeIcon: {
			type: [Function, String]
		},
		closable: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			closeTimer: null
		}
	},
	mounted() {
		if (this.duration !== 0) {
			this.closeTimer = setTimeout(() => {
				this.close()
			}, this.duration * 1000)
		}
	},
	methods: {
		clearCloseTimer() {
			if (this.closeTimer) {
				clearTimeout(this.closeTimer)
				this.closeTimer = null
			}
		},
		close(type) {
			this.clearCloseTimer()
			this.$parent.close(this.name, type)
		}
		// btnHandle(btn) {
		// 	console.log(btn)
		// 	new Vue({
		// 		el: '#notice-btns',
		// 		render: h => {
		// 			return btn(h)
		// 		}
		// 	})
		// }
	}
}
</script>
<style lang=less>
.zen-notice {
	position: relative;
	width: auto;
	margin-top: -8px;
	padding: 8px;
	&.ant-message {
		text-align: center;
		.zen-notice-content {
			display: inline-block;
		}
	}
}

.zen-notice-content {
	position: relative;
	padding: 8px 16px;
	border-radius: 4px;
	-webkit-box-shadow: 0 4px 12px hsla(227, 18%, 20%, 0.12);
	box-shadow: 0 4px 12px hsla(227, 18%, 20%, 0.12);
	background: #fff;
	pointer-events: all;
}
</style>
