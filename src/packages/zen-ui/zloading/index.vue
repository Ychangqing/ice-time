<template>
	<a-spin
		:spinning="spinning"
		:delay="delay"
		:tip="tip"
		:wrapperClassName="wrapperClassName"
		:indicator="indicator"
	>
		<slot></slot>
	</a-spin>
</template>

<script>
export default {
	name: 'zloading',
	data() {
		return {
			opacityTime: 0.7,
			rotateBegin: 0,
			keySplines: '0.19, 1, 0.22, 1',
			indicator: this.$createElement('img', {
				style: {
					width: '54px',
					height: '54px'
				},
				attrs: {
					src:
						'https://oss-static-origin.oss-cn-hongkong.aliyuncs.com/oss-static/loading.svg?t=' +
						new Date().getTime()
				}
			})
		}
	},
	watch: {
		spinning(newValue) {
			if (newValue) {
				this.indicator = this.$createElement('img', {
					style: {
						width: '54px',
						height: '54px'
					},
					attrs: {
						src:
							'https://oss-static-origin.oss-cn-hongkong.aliyuncs.com/oss-static/loading.svg?t=' +
							new Date().getTime()
					}
				})
			}
		}
	},
	props: {
		spinning: {
			type: Boolean,
			default: true
		},
		tip: {
			type: String
		},
		wrapperClassName: {
			type: String
		},
		delay: {
			type: Number
		},
		show: {
			type: Boolean
		}
	}
}
</script>

<style lang=less scope>
.ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
	margin: -27px;
}

.ant-spin-nested-loading > div > .ant-spin .ant-spin-text {
	padding-top: 20px;
}

.ant-spin-nested-loading > div > .ant-spin.ant-spin-show-text .ant-spin-dot {
	margin-top: -32px;
}

.box-shadow {
	/* display: flex;
    justify-content: center;
    align-items: center; */
}

.box-shadow-fixed {
	position: fixed;
	overflow: hidden;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 9999;
}
</style>


