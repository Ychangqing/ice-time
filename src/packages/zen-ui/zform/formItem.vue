<template>
	<!--<div v-if="!fixedLabelWidth">
        <a-form-item :label="$t(item.label) || ''"
                :label-col="{
                    xs: { span: 24, offset: 0 },
                    sm: { span: item.labelCol || 8, offset:0 },
                }"
                :validate-status="item.validate && item.validate.validateStatus"
                :help="item.validate && item.validate.errorMsg"
                :wrapper-col="{
                    xs: { span: 24, offset: 0 },
                    sm: { span: item.wrapperCol || 16, offset: 0 },
                }"
                :required="(item.validate || item.rules) ? true : item.hasSubValidate ? false : null" v-show="!item.isHidden">
            <slot></slot>
        </a-form-item>
	</div>-->
	<div :class="['custom-label-loyat',formLayout]">
		<div
			:class="['custom-label-loyat__left',size]"
			v-if="!!item.label"
			:style="{minWidth:fixedLabelWidth,textAlign:textAlign}"
		>
			<span style="color:red" v-if="(item.rules && !!item.rules.length) || item.validate">*</span>
			{{$t(item.label)}}
		</div>
		<div class="custom-label-loyat__right">
			<a-form-item
				label
				:label-col="{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 0, offset:0 },
                }"
				:wrapper-col="{
                    xs: { span: 24, offset: 0 },
                    sm: { span: item.wrapperCol || 24, offset: 0 },
                }"
				:validate-status="item.validate && item.validate.validateStatus"
				:help="item.validate && item.validate.errorMsg"
				:required="(item.validate || item.rules) ? true : item.hasSubValidate ? false : null"
				v-show="!item.isHidden"
				:style="{maxWidth: item.maxWidth, marginBottom: '10px'}"
			>
				<span
					style="color:red;vertical-align: middle;padding-right: 8px;"
					v-if="!item.label && ((item.rules && !!item.rules.length) || item.validate)"
				>*</span>
				<a-popover
					v-if="item.popoverContent"
					:defaultVisible="false"
					:placement="item.placement || 'bottomLeft'"
					:mouseEnterDelay="item.mouseEnterDelay || 0"
					:mouseLeaveDelay="item.mouseLeaveDelay || 0"
					:overlayStyle="{'width': item.overlayWidth ? (typeof item.overlayWidth === 'number' ? item.overlayWidth + 'px' : item.overlayWidth) : '300px', 'word-wrap': 'break-word'}"
					:autoAdjustOverflow="true"
				>
					<div v-if="item.popoverTitle" slot="title" v-html="item.popoverTitle"></div>
					<div
						v-if="item.popoverContent && item.popoverContent!== true"
						slot="content"
						v-html="item.popoverContent"
					></div>
					<div @mouseover="mouseoverHandle(item)" @mouseleave="mouseleaveHandle(item)">
						<slot></slot>
					</div>
				</a-popover>
				<slot v-else></slot>
			</a-form-item>
		</div>
	</div>
</template>

<script>
export default {
	name: '',
	data() {
		return {}
	},
	props: {
		item: {
			type: Object
		},
		fixedLabelWidth: {
			type: String,
			default: '60px'
		},
		textAlign: {
			type: String,
			default: 'right'
		},
		formLayout: {
			type: String,
			default: 'horizontal'
		},
		size: {
			type: String,
			default: 'default'
		}
	},
	methods: {
		itemCallback(attr = {}, fn) {
			if (Object.keys(attr).length === 0) {
				return
			}
			attr.item[fn](attr.item)
		},
		mouseoverHandle(item) {
			if (item.mouseoverHandle) {
				this.itemCallback({ item }, 'mouseoverHandle')
			}
		},
		mouseleaveHandle(item) {
			if (item.mouseleaveHandle) {
				this.itemCallback({ item }, 'mouseleaveHandle')
			}
		}
	},
	mounted() {}
}
</script>

<style lang=less>
</style>
