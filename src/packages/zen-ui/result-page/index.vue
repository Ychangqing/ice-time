<template>
	<div :class="['ant-result', `ant-result-${status}`]" style="margin-bottom: 16px;">
		<div class="ant-result-icon">
			<a-icon v-if="status === 'success'" type="check-circle" theme="filled" />
			<a-icon v-if="status === 'error'" type="close-circle" theme="filled" />
		</div>
		<div class="ant-result-title" v-if="status === 'success'">提交成功</div>
		<div class="ant-result-title" v-if="status === 'error'">提交失败</div>
		<div class="ant-result-subtitle" v-text="resultSubtitle"></div>
		<div class="ant-result-content">
			<slot name="resultContent"></slot>
		</div>
		<div class="ant-result-extra">
			<slot name="resultExtra"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'zresult-page',
	props: {
		status: {
			type: String
		},
		resultSubtitle: {
			type: String
		}
	}
}
</script>

<style lang=less scope>
@import './style/index.less';

.ant-result {
	padding: 96px 32px;
	background-color: #fff;
}
.ant-result-success .anticon {
	color: #52c41a;
}
.ant-result-error .anticon {
	color: #f5222d;
}
.ant-result-icon {
	margin-bottom: 24px;
	text-align: center;
	.anticon {
		font-size: 72px;
	}
}
.ant-result-image {
	width: 250px;
	height: 295px;
	margin: auto;
}
.ant-result-title {
	color: rgba(0, 0, 0, 0.85);
	font-size: 24px;
	line-height: 1.8;
	text-align: center;
}
.ant-result-subtitle {
	color: rgba(0, 0, 0, 0.45);
	font-size: 14px;
	line-height: 1.6;
	text-align: center;
}
.ant-result-content {
	margin-top: 24px;
	padding: 24px 40px;
	background-color: #fafafa;
}
.ant-result-extra {
	margin-top: 32px;
	text-align: center;
	a {
		margin-right: 8px;
	}
}
</style>
