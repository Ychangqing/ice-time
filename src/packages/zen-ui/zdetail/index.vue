<template>
	<div
		:class="containerClass"
		:style="`padding: ${detailConf.padding || '16px 0'}px;background: ${detailConf.background || '#fff'}`"
	>
		<h3
			v-if="detailConf.label"
			:class="`zen-title--${classNameSuffix}`"
			style="text-align: left"
			v-html="$t(detailConf.label)"
		></h3>
		<a-row :class="`zen-row--${classNameSuffix}`">
			<template style="margin: 8px 0px" v-for="(column, columnIndex) in detailConf.columns">
				<a-col
					v-if="permissionHandle(column)"
					:class="`zen-col--${classNameSuffix}`"
					:style="{lineHeight: 1.5, paddingBottom: detailConf.colPaddingBottom || '5px'}"
					:span="column.col || detailConf.col || 24"
					:key="columnIndex"
				>
					<div class="detail-item-layout" :class="[detailConf.detailLayout || 'horizontal']">
						<div
							v-if="column.label"
							:class="['detail-item-label', detailConf.labelTextAlign || 'center']"
							:style="`width: ${detailConf.fixedWidth ? typeof detailConf.fixedWidth === 'number' ? detailConf.fixedWidth + 'px' : detailConf.fixedWidth : 'auto'};max-width: ${detailConf.fixedWidth ? typeof detailConf.fixedWidth === 'number' ? detailConf.fixedWidth + 'px' : detailConf.fixedWidth : '30%'}`"
						>
							<span class="content">{{$t(column.label)}}</span>
							<div class="detail-item-colon">:</div>
						</div>
						<div
							class="detail-item-content"
							:class="[detailConf.contentTextAlign || 'center', detailConf.contentWrapLines ? 'warp' : '', column.className]"
							:style="column.styleObject"
						>
							<!-- 前缀 -->
							<template v-if="column.addonBefore">
								<span
									v-html="typeof column.addonBefore === 'function' ? detailItemCallback({column}, 'addonBefore') : column.addonBefore"
								></span>
							</template>
							<!-- 开始渲染内容，分为带气泡卡片和不带气泡卡片两种类型 -->
							<template v-for="(template, tempalteIndex) in column.templates || [column]">
								<template v-if="permissionHandle(template)">
									<a-popover
										v-if="template.popoverContent"
										:key="tempalteIndex"
										:defaultVisible="false"
										:placement="template.placement || 'bottomLeft'"
										:mouseEnterDelay="template.mouseEnterDelay || 0"
										:mouseLeaveDelay="template.mouseLeaveDelay || 0"
										:overlayStyle="{'width': template.overlayWidth ? (typeof template.overlayWidth === 'number' ? template.overlayWidth + 'px' : template.overlayWidth) : '300px', 'word-wrap': 'break-word'}"
										:autoAdjustOverflow="true"
									>
										<div v-if="template.popoverTitle" slot="title" v-html="template.popoverTitle"></div>
										<div v-if="template.popoverContent" slot="content" v-html="template.popoverContent"></div>

										<!-- 带气泡卡片的普通文字 -->
										<template v-if="!template.type || template.type === 'text'">
											<span
												v-if="!editting"
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
												v-text="getDetailItemText(template)"
											></span>

											<!-- 引入编辑组件 -->
											<editComponent
												v-if="template.editOptions"
												:editting="editting"
												:defaultValue="getDetailItemText(template)"
												@editInputChange="(value) =>  editInputChange(record, template, value)"
												@saveHandle="editting = false; saveHandle(getDetailItemText(template), template)"
												@cancelHandle="editting = false; cancelHandle(template)"
												@startEdit="editting=true"
												:iconType="template.editOptions.iconType"
												:theme="template.editOptions.theme"
												:className="template.editOptions.className"
												:fontSize="template.editOptions.fontSize"
												:fontColor="template.editOptions.fontColor"
												:prefixId="getPrefixId(template, columnIndex)"
											></editComponent>
										</template>

										<!-- 带气泡卡片的链接 -->
										<template v-if="template.type === 'link'">
											<span @mouseover="mouseoverHandle(template)" @mouseleave="mouseleaveHandle(template)">
												<zlink
													v-if="!editting"
													:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
													@jumpTo="jumpTo(template)"
												>
													<template v-if="template.iconType">
														<zicon
															:iconType="template.iconType"
															:spin="template.spin"
															:theme="template.theme"
															:className="template.className"
															:fontSize="template.fontSize"
															:fontColor="template.fontColor"
														></zicon>
													</template>
													<template v-else>{{getDetailItemText(template)}}</template>
												</zlink>
											</span>

											<!-- 引入编辑组件 -->
											<editComponent
												v-if="template.editOptions"
												:editting="editting"
												:defaultValue="getDetailItemText(template)"
												@editInputChange="(value) =>  editInputChange(record, template, value)"
												@saveHandle="editting = false; saveHandle(getDetailItemText(template), template)"
												@cancelHandle="editting = false; cancelHandle(template)"
												@startEdit="editting=true"
												:iconType="template.editOptions.iconType"
												:theme="template.editOptions.theme"
												:className="template.editOptions.className"
												:fontSize="template.editOptions.fontSize"
												:fontColor="template.editOptions.fontColor"
												:prefixId="getPrefixId(template, columnIndex)"
											></editComponent>
										</template>

										<!-- 带气泡卡片的自定义HTML -->
										<template v-if="template.type === 'render'">
											<span
												v-for="(paperItem, paperIndex) in template.paperArray ? detailItemCallback({template}, 'paperArray') : [record]"
												:key="paperIndex"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												v-html="template.renderContent ? detailItemCallback({template, paperItem}, 'renderContent') : ''"
											></span>
										</template>

										<!-- 带气泡卡片的日期 -->
										<template v-if="template.type === 'time'">
											<span
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
											>{{moment(getDetailItemText(template)).format(template.format || 'YYYY-MM-DD HH:mm:ss')}}</span>
										</template>

										<!-- 带气泡卡片的icon -->
										<template v-if="template.type === 'icon'">
											<span
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
											>
												<zicon
													:iconType="template.iconType"
													:spin="template.spin"
													:theme="template.theme"
													:className="template.className"
													:style="{'margin':getRecordMargin(template, column), 'cursor': 'pointer'}"
													:fontSize="(template.fontSize || 14) + 'px'"
													:fontColor="typeof template.color === 'function' ? detailItemCallback({template}, 'color') : template.color || '#454e61'"
												></zicon>
											</span>
										</template>

										<!-- 带气泡卡片的按钮 -->
										<template
											v-if="template.type==='btn'"
											class="table-column--btn"
											@click.stop="(e)=>{clickHandle(e,template)}"
											:id="setIdToColumn(template, columnIndex)"
											@mouseover.stop="mouseoverHandle(template)"
											@mouseleave.stop="mouseleaveHandle(template)"
											:style="{'margin':getRecordMargin(template, column)}"
										>
											<a-button
												:type="template.btnType || 'primary'"
												:disabled="template.btnDisabled"
											>{{template.text}}</a-button>
										</template>

										<!-- 带气泡卡片的 btn-link -->
										<template v-else-if="template.type==='btn-link'">
											<a
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
												@click.stop="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover.stop="mouseoverHandle(template)"
												@mouseleave.stop="mouseleaveHandle(template)"
												href="javascript:void(0)"
											>{{template.text}}</a>
										</template>

										<!-- 带气泡卡片的tag -->
										<template v-else-if="template.type==='tag'">
											<a-tag
												@click.stop="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												:style="{
													margin: getRecordMargin(template, column),
													backgroundColor: getColor(template, record, 'backgroundColor') || getColor(template, record, 'colourSystem'),
													color: getColor(template, record, 'color') || '',
													border: (template.color || template.backgroundColor) ? 'none' : '',
													lineHeight: 1.5
												}"
												:color="getColor(template, record, 'colourSystem')"
											>{{getDetailItemText(template)}}</a-tag>
										</template>
									</a-popover>

									<!-- without  popoverContent -->
									<label v-if="!template.popoverContent" :key="tempalteIndex">
										<!-- 普通文字 -->
										<template v-if="!template.type || template.type === 'text'">
											<span
												v-if="!editting"
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column, 'text')}"
												v-text="getDetailItemText(template)"
											></span>

											<!-- 引入编辑组件 -->
											<editComponent
												v-if="template.editOptions"
												:editting="editting"
												:defaultValue="getDetailItemText(template)"
												@editInputChange="(value) =>  editInputChange(record, template, value)"
												@saveHandle="editting = false; saveHandle(getDetailItemText(template), template)"
												@cancelHandle="editting = false; cancelHandle(template)"
												@startEdit="editting = true"
												:iconType="template.editOptions.iconType"
												:theme="template.editOptions.theme"
												:className="template.editOptions.className"
												:fontSize="template.editOptions.fontSize"
												:fontColor="template.editOptions.fontColor"
												:prefixId="getPrefixId(template, columnIndex)"
											></editComponent>
										</template>

										<!-- 链接 -->
										<template v-if="template.type === 'link'">
											<span @mouseover="mouseoverHandle(template)" @mouseleave="mouseleaveHandle(template)">
												<zlink
													v-if="!editting"
													:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
													@jumpTo="jumpTo(template)"
												>
													<template v-if="template.iconType">
														<zicon
															:iconType="template.iconType"
															:spin="template.spin"
															:theme="template.theme"
															:className="template.className"
															:fontSize="template.fontSize"
															:fontColor="template.fontColor"
														></zicon>
													</template>
													<template v-else>{{getDetailItemText(template)}}</template>
												</zlink>
											</span>

											<!-- 引入编辑组件 -->
											<editComponent
												v-if="template.editOptions"
												:editting="editting"
												:defaultValue="getDetailItemText(template)"
												@editInputChange="(value) =>  editInputChange(record, template, value)"
												@saveHandle="editting = false; saveHandle(getDetailItemText(template), template)"
												@cancelHandle="editting = false; cancelHandle(template)"
												@startEdit="editting=true"
												:iconType="template.editOptions.iconType"
												:theme="template.editOptions.theme"
												:className="template.editOptions.className"
												:fontSize="template.editOptions.fontSize"
												:fontColor="template.editOptions.fontColor"
												:prefixId="getPrefixId(template, columnIndex)"
											></editComponent>
										</template>

										<!-- 自定义HTML -->
										<template v-if="template.type === 'render'">
											<span
												v-for="(paperItem, paperIndex) in template.paperArray ? detailItemCallback({template}, 'paperArray') : [record]"
												:key="paperIndex"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												v-html="template.renderContent ? detailItemCallback({template, paperItem}, 'renderContent') : ''"
											></span>
										</template>

										<!-- 图片 -->
										<template v-if="template.type === 'img'">
											<template v-if="getSlidesHandle(template)">
												<ul ref="zenDetailGallery" class="zen-detail-gallery">
													<template v-for="(slideItem, slideIndex) in getSlidesHandle(template)">
														<li v-show="slideIndex < (template.maxImg || 1)" :key="slideIndex">
															<a :href="slideItem.src">
																<img :src="slideItem.msrc" :title="slideItem.title" />
															</a>
														</li>
													</template>
												</ul>
												<div
													v-if="(template.maxImg || 0) < getSlidesHandle(template).length"
													class="zen-detail-gallery-more-btn"
												>
													<span>
														共{{getSlidesHandle(template).length}}张图片
														<a @click="openZenDetailGallery">查看</a>
													</span>
												</div>
											</template>
											<template v-else>
												<span>{{template.noneValue}}</span>
											</template>
										</template>

										<!-- 日期 -->
										<template v-if="template.type === 'time'">
											<span
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
											>{{moment(getDetailItemText(template)).format(template.format || 'YYYY-MM-DD HH:mm:ss')}}</span>
										</template>

										<!-- 图标 -->
										<template v-if="template.type === 'icon'">
											<span
												@click="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover="mouseoverHandle(template)"
												@mouseleave="mouseleaveHandle(template)"
											>
												<zicon
													:iconType="template.iconType"
													:spin="template.spin"
													:theme="template.theme"
													:className="template.className"
													:style="{'margin':getRecordMargin(template, column), 'cursor': 'pointer'}"
													:fontSize="(template.fontSize || 14) + 'px'"
													:fontColor="typeof template.color === 'function' ? detailItemCallback({template}, 'color') : template.color || '#454e61'"
												></zicon>
											</span>
										</template>

										<!-- 按钮 -->
										<template
											v-if="template.type==='btn'"
											class="table-column--btn"
											@click.stop="(e)=>{clickHandle(e,template)}"
											:id="setIdToColumn(template, columnIndex)"
											@mouseover.stop="mouseoverHandle(template)"
											@mouseleave.stop="mouseleaveHandle(template)"
											:style="{'margin':getRecordMargin(template, column)}"
										>
											<a-button
												:type="template.btnType || 'primary'"
												:disabled="template.btnDisabled"
											>{{template.text}}</a-button>
										</template>

										<!-- btn-link -->
										<template v-else-if="template.type==='btn-link'">
											<a
												:style="{'color': getColor(template, record, 'color'), 'margin':getRecordMargin(template, column)}"
												@click.stop="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												@mouseover.stop="mouseoverHandle(template)"
												@mouseleave.stop="mouseleaveHandle(template)"
												href="javascript:void(0)"
											>{{template.text}}</a>
										</template>

										<!-- tag -->
										<template v-else-if="template.type==='tag'">
											<a-tag
												@click.stop="(e)=>{clickHandle(e,template)}"
												:id="setIdToColumn(template, columnIndex)"
												:style="{
													margin: getRecordMargin(template, column),
													backgroundColor: getColor(template, record, 'backgroundColor') || getColor(template, record, 'colourSystem'),
													color: getColor(template, record, 'color') || '',
													border: (template.color || template.backgroundColor) ? 'none' : '',
													lineHeight: 1.5
												}"
												:color="getColor(template, record, 'colourSystem')"
											>{{getDetailItemText(template)}}</a-tag>
										</template>

										<template v-else-if="template.type==='switch'">
											<a-switch
												v-if="!template.checkedChildrenType || template.checkedChildrenType == 'string'"
												:disabled="template.isDisabled || false"
												:checked="template.defaultChecked ? template.defaultChecked({template, record}) : false"
												:checkedChildren="template.checkedChildren || null"
												:unCheckedChildren="template.unCheckedChildren || null"
												@change="(checked, e)=>{changeHandle(template, checked)}"
											/>
											<a-switch
												v-if="template.checkedChildrenType && template.checkedChildrenType == 'icon'"
												:disabled="template.isDisabled || false"
												:checked="template.defaultChecked ? template.defaultChecked({template, record}) : false"
												@change="(checked, e)=>{changeHandle(template, checked)}"
											>
												<a-icon :type="template.checkedChildren" slot="checkedChildren" />
												<a-icon :type="template.unCheckedChildren" slot="unCheckedChildren" />
											</a-switch>
										</template>
									</label>
								</template>
							</template>

							<!-- 后缀 -->
							<template v-if="column.addonAfter">
								<span
									v-html="typeof column.addonAfter === 'function' ? detailItemCallback({column}, 'addonAfter') : column.addonAfter"
								></span>
							</template>
						</div>
					</div>
				</a-col>
			</template>
		</a-row>
		<a-row>
			<a-col :span="8"></a-col>
		</a-row>
	</div>
</template>

<script>
import zicon from '../zicon/index.vue'
import zlink from '../zlink/index.vue'

import editComponent from './components/editComponent'
import moment from 'moment'
import photoboxJS from './photobox/jquery.photobox.js'
import $ from 'jquery'
var cloneDeep = require('lodash.clonedeep')
moment.locale('zh-cn')
export default {
	name: 'zdetail',
	props: {
		detailConf: {
			type: Object
		},
		detailData: {
			type: Object
		}
	},
	components: {
		editComponent,
		zicon,
		zlink
	},
	computed: {
		containerClass() {
			return [
				this.classNameSuffix
					? `zen-detail--${this.classNameSuffix}`
					: 'zen-detail--cell',
				this.detailConf.size
			]
		},
		layoutIsObject() {
			return typeof this.detailConf.layout === 'object'
		},
		classNameSuffix() {
			const layout = this.detailConf.layout
			if (layout) return this.layoutIsObject ? layout.style : layout
			return ''
		}
	},
	data() {
		return {
			record: {},
			editting: false,
			changeTimeout: null,
			changeWaitTime: 200
		}
	},
	created() {
		this.initRecord(this.detailData)
	},
	watch: {
		detailData: {
			handler(newValue, oldValue) {
				this.initRecord(newValue)
			},
			deep: true
		}
	},
	methods: {
		moment,
		initRecord(newValue) {
			this.record = cloneDeep(newValue)
		},
		getColor(template, record, arg) {
			const colorArg = arg.split('.').reduce((template, val) => {
				return template[val]
			}, template)
			return typeof colorArg === 'function'
				? colorArg({ record, template })
				: colorArg
		},
		openZenDetailGallery() {
			$(this.$refs.zenDetailGallery)
				.find('a')[0]
				.click()
		},
		detailItemCallback(attr = {}, fn) {
			if (Object.keys(attr).length === 0 || !attr.template) {
				return
			}
			attr.record = this.record
			attr.index = this.detailConf.rowIndex
			const template = attr.template
			return fn.split('.').reduce((template, val) => {
				return template[val]
			}, template)(attr)
		},
		clickHandle(e, template) {
			// if (this.$utt.isRunning && !this.detailConf.disableUITest) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let { type } = template
				let task = {}
				task.by_select = `id`
				task.by_val = `${e.target.id}`
				task.param = this.getDetailItemText(template)
				task.time = this.$utt.getTime(this.detailConf.name)
				if (type === 'btn' || type === 'btn-link' || type === 'icon') {
					task.type = 'click'
					task.step = '点击事件'
				} else {
					task.type = 'check'
					task.step = '校验文本值'
				}
				this.$utt.addTask(task)
			}
			if (template.clickHandle) {
				this.detailItemCallback({ template }, 'clickHandle')
			}
		},
		changeHandle(template, checked) {
			if (this.changeTimeout !== null) {
				clearTimeout(this.changeTimeout)
			}
			this.changeTimeout = setTimeout(() => {
				if (template.changeHandle) {
					this.detailItemCallback(
						{ template, checked },
						'changeHandle'
					)
				}
			}, this.changeWaitTime)
		},
		mouseoverHandle(template) {
			if (template.mouseoverHandle) {
				this.detailItemCallback({ template }, 'mouseoverHandle')
			}
		},
		mouseleaveHandle(template) {
			if (template.mouseleaveHandle) {
				this.detailItemCallback({ template }, 'mouseleaveHandle')
			}
		},
		permissionHandle(template) {
			if (!template.permissionHandle) {
				return true
			}
			return this.detailItemCallback({ template }, 'permissionHandle')
		},
		getSlidesHandle(template) {
			if (!template.getSlidesHandle) {
				return
			}
			let slides = this.detailItemCallback(
				{ template },
				'getSlidesHandle'
			)
			if (!slides || slides.length === 0) {
				return
			}
			let paperSlides = []
			slides.forEach(item => {
				if (typeof item === 'string') {
					paperSlides.push({
						src: item,
						msrc: item,
						w: 1440,
						h: 900
					})
				}
				if (typeof item === 'object' && item.src) {
					paperSlides.push({
						src: item.src,
						msrc: item.msrc || item.src,
						w: item.w || 1440,
						h: item.h || 900
					})
				}
			})
			this.$nextTick(() => {
				$(this.$refs.zenDetailGallery).photobox('a', {
					thumbs: true,
					loop: true,
					zoomable: false
				})
			})
			return paperSlides
		},
		jumpTo(template) {
			if (!template.href) {
				return
			}
			const path = this.detailItemCallback(
				{ record: this.record, template },
				'href'
			)
			if (template.target) {
				window.open(path, template.target)
			} else {
				this.$router.push(path)
			}
		},
		getDatakey(datakey) {
			let record = this.record
			return (
				datakey.split('.').reduce((record, val) => {
					return record[val]
				}, record) || ''
			)
		},
		mappingHandle(val, mapping) {
			let result = ''
			mapping.forEach(item => {
				if (val == item.value) {
					result = item.text || item.label || ''
				}
			})
			return result
		},
		getDetailItemText(template) {
			let itemText = ''
			if (template.mapping) {
				itemText = template.props
					? this.mappingHandle(
							this.getDatakey(template.props),
							template.mapping
					  )
					: this.mappingHandle(this.getDatakey(template.text))
			} else {
				itemText = template.props
					? this.getDatakey(template.props)
					: template.text
			}
			return itemText || template.noneValue || '-'
		},
		getRecordMargin(template, column) {
			// 这个方法要加载zdetail中，同时在zdetail中增加space属性
			const space = template.space >= 0 ? template.space : column.space
			return '0 ' + (space || 0) + 'px'
		},
		editInputChange(record, template, value) {
			const dataKeyArr = template.props.split('.')
			dataKeyArr.reduce((record, val, index) => {
				if (index === dataKeyArr.length - 1) {
					record[val] = value
				}
				return record[val]
			}, record)
		},
		saveHandle(newValue, template) {
			if (!template.editOptions || !template.editOptions.saveHandle) {
				return
			}
			const detailData = this.detailData
			this.record = cloneDeep(detailData)

			const oldValue =
				template.props.split('.').reduce((detailData, val) => {
					return detailData[val]
				}, detailData) || ''

			this.detailItemCallback(
				{ newValue, oldValue, template },
				'editOptions.saveHandle'
			)
		},
		cancelHandle(template) {
			this.record = cloneDeep(this.detailData)
			if (!template.editOptions || !template.editOptions.cancelHandle) {
				return
			}
			this.detailItemCallback({ template }, 'editOptions.cancelHandle')
		},
		getPrefixId(template, columnIndex) {
			let listrow =
				this.detailConf.rowIndex >= 0
					? 'row-' + this.detailConf.rowIndex + '-'
					: ''
			let tmpRow = columnIndex >= 0 ? 'tmprow' + columnIndex + '-' : ''
			return listrow + tmpRow
		},
		setIdToColumn(template, columnIndex) {
			let prefixid = this.getPrefixId(template, columnIndex)
			return prefixid + template.props
		}
	}
}
</script>
<style lang="less" >
@import './style/ui.less';
@import './photobox/photobox.css';
#pbOverlay {
	z-index: 10002;
}
.zen-detail-gallery-more-btn {
	position: relative;
	max-width: 150px;
	width: 150px;
	height: 68px;
	margin: 1px;
	float: left;
	overflow: hidden;
	span {
		width: 100%;
		position: absolute;
		bottom: 0px;
	}
}

.zen-detail-gallery {
	li {
		list-style: none;
		perspective: 100px;
		margin: 4px;
		float: left;
		position: relative;
		transition: 0.1s;
		-webkit-perspective: 100px;
		-webkit-transition: 0.1s;
		a {
			display: block;
			width: 75px;
			height: 68px;
			overflow: hidden;
			background: rgba(0, 0, 0, 0.1);
			transition: 0.4s ease-out;
			-webkit-transform: rotateX(0deg) translate(0, 0);
			transform: rotateX(0deg) translate(0, 0);
		}
		a:active,
		a:focus {
			outline: none;
		}
		a:hover {
			box-shadow: @Shadow-3-B;
			transition: 0.1s;
			-webkit-transition: 0.1s;
		}
		a img {
			min-height: 100%;
			width: 100%;
			transition: 0.3s ease-out;
			-webkit-transition: 0.3s ease-out;
		}
		&:hover {
			z-index: 2;
			transform: scale(1.05);
		}
		&:hover img {
			transform: scale(1.05);
		}
	}
}

.zen-detail--cell {
	font-size: @font-size-base;
	&.large {
		font-size: @font-size-lg;
	}
	&.default {
		font-size: @font-size-base;
	}
}
.detail-item-layout {
	display: flex;
	width: 100%;
	.detail-item-label {
		width: fit-content;
		max-width: 30%;
		height: auto;
		word-wrap: break-word;
		word-break: break-all;
		color: @text1-2;
		&.left {
			text-align: left;
		}
		&.center {
			text-align: center;
		}
		&.right {
			text-align: right;
		}
	}
	.detail-item-colon {
		display: inline;
		color: @text1-2;
		position: relative;
		top: -0.5px;
		margin: 0 8px 0 2px;
	}
	.detail-item-content {
		position: relative;
		color: @text1-2;
		flex: 1;
		height: auto;
		word-wrap: break-word;
		word-break: break-all;
		&.left {
			text-align: left;
		}
		&.center {
			text-align: center;
		}
		&.right {
			text-align: right;
		}
		&.warp {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	&.horizontal {
		flex-direction: row;
	}
	&.vertical {
		flex-direction: column;
		.detail-item-label {
			max-width: 100%;
			width: 100%;
		}
		.detail-item-content {
			width: 100%;
		}
	}
}
</style>
