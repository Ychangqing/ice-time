<template>
	<a-card :class="cardClass" :style="cardStyle" v-bind="cardBind">
		<a-button slot="extra" type="primary" @click="addHandle" icon="plus" v-if="addBtn">New</a-button>
		<a-button slot="extra" @click="downloadHandle" icon="download" v-if="hasDownload">Download</a-button>
		<slot slot="extra" name="header"></slot>
		<slot slot="cover" name="cover"></slot>
		<a-icon
			slot="extra"
			:class="rightIconClass"
			type="right"
			v-if="hasCollapse"
			@click.native="triggerContent"
		/>
		<div
			ref="contents"
			:class="contentClass"
			:style="contentStyle"
			v-if="!!defaultActiveRepeat && defaultActiveRepeat == true"
		>
			<slot></slot>
			<div :class="gridClass" style="padding: 10px;" v-if="cardGrid">
				<a-card-grid :style="gridStyle" v-for="(item, index) in cardGrid" :key="index">
					<h3 v-text="item.title || ''"></h3>
					<p v-text="item.sub || ''"></p>
					<slot name="cardGrid" :text="item"></slot>
				</a-card-grid>
			</div>
		</div>
		<slot name="bottom" slot="actions"></slot>
		<a-card-meta :title="meta.title" v-if="meta">
			<template slot="description">{{meta.description}}</template>
		</a-card-meta>
	</a-card>
</template>

<script>
const prefixCls = 'zen-card'
let num = 0
export default {
	name: 'zcard',
	props: {
		hasCollapse: {
			type: Boolean
		},
		defaultCollapse: {
			type: Boolean,
			default: true
		},
		padding: {
			type: Number
		},
		bordered: {
			type: Boolean,
			default: true
		},
		background: {
			type: String
		},
		hoverable: {
			type: Boolean
		},
		loading: {
			type: Boolean
		},
		title: {
			type: String
		},
		addBtn: {
			type: Object
		},
		hasDownload: {
			type: Boolean
		},
		downloadUrl: {
			type: String
		},
		meta: {
			type: Object
		},
		cardGrid: {
			type: Array
		},
		gridPercent: {
			type: String
		}
	},
	data() {
		return {
			defaultActiveRepeat: this.defaultCollapse, // 初始展开/收缩
			defaultActive: this.defaultCollapse, // 展开/收缩
			height: 0
		}
	},
	computed: {
		cardStyle: function() {
			return {
				padding: this.padding,
				background: this.background
			}
		},
		cardBind: function() {
			return {
				title: this.title || this.$locale.title,
				bordered: this.bordered,
				hoverable: this.hoverable,
				loading: this.loading
			}
		},
		rightIconClass: function() {
			return [
				{
					[`${prefixCls}-right--icon`]: this.defaultActive,
					[`${prefixCls}-down--icon`]: !this.defaultActive
				},
				[`${prefixCls}--icon__collapse`]
			]
		},
		cardClass: function() {
			return `${prefixCls}`
		},
		gridClass: function() {
			return `${prefixCls}--grid`
		},
		contentClass: function() {
			return [
				{
					[`${prefixCls}--content__down`]: this.hasCollapse
				},
				[`${prefixCls}--content`]
			]
		},
		contentStyle: function() {
			return [
				this.defaultActive
					? {
							height: 'auto'
					  }
					: {
							height: 0
					  }
			]
		},
		gridStyle: function() {
			return this.gridPercent
				? {
						width: this.gridPercent + '%'
				  }
				: {
						width: '100%'
				  }
		}
	},
	methods: {
		triggerContent() {
			this.defaultActiveRepeat = true
			this.defaultActive = !this.defaultActive
		},
		downloadHandle() {
			var iframe = document.createElement('iframe')
			iframe.src = this.downloadUrl
			iframe.style.display = 'none'
			document.body.appendChild(iframe)
		},
		addHandle() {
			if (this.addBtn.url) {
				if (this.addBtn.linkStyle && this.addBtn.linkStyle == 'blank') {
					const { href } = this.$router.resolve(this.addBtn.url)
					window.open(href, '_blank')
				} else {
					this.$router.push(this.addBtn.url)
				}
			}
			this.$emit('on-addHandle', this.addBtn)
		}
	}
}
</script>
<style lang=less>
@import './style/index.less';
</style>
