<template>
	<div class="ztable">
		<div class="ztable__operate">
			<div>
				<a-button type="primary" @click="addHandle" icon="plus" v-if="localTableConfig.addBtn">New</a-button>
				<slot name="leftArea"></slot>
			</div>
			<div>
				<slot name="rightArea"></slot>

				<a-input-search
					v-if="localTableConfig.searchBy"
					:placeholder="localTableConfig.searchBy.placeholder"
					@search="value => {searchHandle(localTableConfig, value)}"
					enterButton="Search"
					id="ztable-search"
					:style="{width: localTableConfig.searchBy.width?localTableConfig.searchBy.width:'300px'}"
				/>
			</div>
		</div>
		<a-table
			:id="tableId"
			:bordered="localTableConfig.bordered"
			:pagination="pagination"
			:columns="localTableConfig.columns"
			:dataSource="tableData"
			:rowSelection="localTableConfig.hasRowSelection ? rowSelection : null"
			:loading="{spinning: loading, indicator: hostLoadingIndicator}"
			:scroll="localTableConfig.scroll || {}"
			:size="localTableConfig.size || 'middle'"
			@change="handleTableChange"
			:rowClassName="(record, index) => {return localTableConfig.rowClassName && localTableConfig.rowClassName(record, index)} "
		>
			<template v-if="localTableConfig.title" slot="title" v-html="localTableConfig.title"></template>
			<template v-if="localTableConfig.footer" slot="footer" v-html="localTableConfig.footer"></template>
			<template
				v-for="(item,colIndex) in formateColumns(localTableConfig.columns)"
				:slot="item.scopedSlots && item.scopedSlots.customRender"
				slot-scope="text, record,index"
			>
				<zdetail :key="colIndex" :detailConf="getZdetailConf(item,index)" :detailData="record"></zdetail>
			</template>
		</a-table>
	</div>
</template>

<script>
import moment from 'moment'
import propsDict from '../../props-dict'

import zdetail from '../zdetail/index.vue'

var cloneDeep = require('lodash.clonedeep')
let localTableColumns = []
export default {
	name: 'ztable',
	components: {
		zdetail
	},
	props: {
		tableId: {
			type: String,
			default: 'ztable__identifier'
		},
		dataSource: {
			type: Array
		},
		tableConfig: {
			type: Object
		},
		pagination: {
			type: Object
		},
		rowSelection: {
			type: Object
		},
		loading: {
			type: Boolean,
			default: false
		},
		propFilterColumns: {
			type: Array
		}
	},
	data() {
		return {
			hostLoadingIndicator: h => {
				return h('img', {
					style: {
						width: '32px',
						height: '32px'
					},
					attrs: {
						src:
							'https://oss-static-origin.oss-cn-hongkong.aliyuncs.com/oss-static/loading.svg?t=' +
							new Date().getTime()
					}
				})
			},
			tableData: [],
			moment: moment,
			localTableConfig: {}
		}
	},
	created() {
		this.initColumns()
	},
	watch: {
		dataSource: {
			handler(newValue, oldValue) {
				this.tableData = cloneDeep(newValue)
				this.$nextTick(() => {
					this.initPaginationEvent()
					let ztable = document.getElementById(this.tableId)

					let pagination = ztable.querySelector(
						'ul.ant-table-pagination'
					)

					let quickJumperInput = pagination.querySelector(
						'li.ant-pagination-options div.ant-pagination-options-quick-jumper input'
					)
					quickJumperInput.onkeydown = e => {
						let keyCode = e.keyCode
						if (keyCode === 13) {
							let xPath = this.getXPathForElement(e.target)
							let value = e.target.value
							if (
								this.$utt &&
								this.$utt.isRunning &&
								!this.isDisabledUTT()
							) {
								//添加uitest日志
								let task = {}
								task.by_select = 'XPath'
								task.by_val = xPath
								task.param = value
								task.type = 'sendKey'
								task.time = '0'
								task.step = '跳转页面输入框'
								this.$utt.addTask(task)
							}
						}
					}
				})
			},
			deep: true
		},
		propFilterColumns: {
			handler(newValue, oldValue) {
				if (!this.$utils.isArray(newValue)) {
					return console.warn('newColumns is not an array!')
				}
				if (localTableColumns.length !== newValue.length) {
					console.warn(
						'originColumns length unequal to newColumns length!'
					)
				}
				const cloneValue = this.$utils.clone(newValue, true)
				this.filterTableColumns(cloneValue)
			},
			deep: true
		},
		tableConfig: {
			handler: function(val, oldVal) {
				this.initColumns()
			},
			deep: true
		}
	},
	mounted() {},
	methods: {
		initPaginationEvent() {
			let ztable = document.getElementById(this.tableId)
			if (!ztable) {
				return
			}
			let pagination = ztable.querySelector('ul.ant-table-pagination')
			if (!pagination) {
				return
			}
			pagination.querySelectorAll('li').forEach(liElm => {
				let className = liElm.className
				if (className.indexOf('ant-pagination-prev') > -1) {
					this.attachEventFn(liElm, e => {
						this.setUutTask(e, 'table 分页器 点击上一页')
					})
				}

				if (className.indexOf('ant-pagination-next') > -1) {
					this.attachEventFn(liElm, e => {
						this.setUutTask(e, 'table 分页器 点击下一页')
					})
				}

				if (className.indexOf('ant-pagination-jump-prev') > -1) {
					this.attachEventFn(liElm, e => {
						this.setUutTask(e, 'table 分页器 点击上5页')
					})
				}

				if (className.indexOf('ant-pagination-jump-next') > -1) {
					this.attachEventFn(liElm, e => {
						this.setUutTask(e, 'table 分页器 点击下5页')
					})
				}

				if (className.indexOf('ant-pagination-item') > -1) {
					this.attachEventFn(liElm, e => {
						this.setUutTask(e, 'table 分页器 切换页码')
					})
				}

				if (className.indexOf('ant-pagination-options') > -1) {
					this.attachEventFn(
						liElm.querySelector(
							'div.ant-pagination-options-size-changer'
						),
						e => {
							this.setUutTask(e, 'table 分页器 改变页面size')
							this.$nextTick(() => {
								let selectDropdown = liElm.querySelector(
									'div.ant-select-dropdown ul.ant-select-dropdown-menu'
								)
								selectDropdown
									.querySelectorAll('li')
									.forEach(item => {
										this.attachEventFn(item, e => {
											this.setUutTask(
												e,
												'table 分页器 改变页面size'
											)
										})
									})
							})
						}
					)
				}
			})
		},
		setUutTask(e, step) {
			let xPath = this.getXPathForElement(e.target)
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = 'XPath'
				task.by_val = xPath
				task.param = ''
				task.type = 'click'
				task.time = '0'
				task.step = step
				this.$utt.addTask(task)
			}
		},
		getXPathForElement(element) {
			const reg = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/
			const idx = (sib, name) =>
				sib
					? idx(sib.previousElementSibling, name || sib.localName) +
					  (sib.localName == name)
					: 1
			const segs = elm =>
				!elm || elm.nodeType !== 1
					? ['']
					: elm.id &&
					  document.getElementById(elm.id) === elm &&
					  elm.id.match(reg) === null
					? [`id("${elm.id}")`]
					: [
							...segs(elm.parentNode),
							`${elm.localName.toLowerCase()}[${idx(elm)}]`
					  ]
			return segs(element).join('/')
		},
		attachEventFn(elm, cb) {
			if (!elm) {
				return
			}
			elm.onclick = null
			this.$nextTick(() => {
				elm.onclick = cb
			})
		},
		initColumns() {
			this.tableData = cloneDeep(this.dataSource)
			this.localTableConfig = cloneDeep(this.tableConfig)
			this.localTableConfig.columns.forEach(val => {
				val.title = this.$t(val.title)
				if (val.text) {
					val.text = this.$t(val.text)
				}
				if (val.templates) {
					val.templates.forEach(itemVal => {
						if (itemVal.text) {
							itemVal.text = this.$t(itemVal.text)
						}
					})
				}
			})
			function formatedColumn(column) {
				if (column.dataIndex && column.scopedSlots) {
					column.props = column.dataIndex
					return
				} else if (column.props) {
					column.dataIndex = column.props
					column.scopedSlots = { customRender: column.props }
				}

				if (column.children) {
					column.children.forEach(item => {
						formatedColumn(item)
					})
				}
			}
			this.localTableConfig.columns.forEach(item => {
				formatedColumn(item)
			})
			localTableColumns = cloneDeep(this.localTableConfig.columns)
			if (
				!this.propFilterColumns ||
				this.propFilterColumns.length === 0
			) {
				this.filterTableColumns(localTableColumns)
				return
			}
			this.filterTableColumns(this.propFilterColumns)
		},
		formateColumns(configColumns) {
			let exploredColumns = []
			function expandColumns(columns) {
				columns.forEach(item => {
					if (item.children && item.children.length > 0) {
						expandColumns(item.children)
					}
					exploredColumns.push(item)
				})
			}
			expandColumns(configColumns)
			return exploredColumns
		},
		getZdetailConf(column, rowIndex) {
			let disableUITest = this.tableConfig.disableUITest || false
			let name = this.tableConfig.name

			return {
				size: 'default',
				detailLayout: column.detailLayout
					? column.detailLayout
					: 'horizontal',
				labelTextAlign: column.labelTextAlign
					? column.labelTextAlign
					: 'left',
				contentTextAlign: column.align ? column.align : 'left',
				padding: '0px',
				colPaddingBottom: '0px',
				background: 'unset',
				disableUITest,
				rowIndex,
				name,
				columns: [column]
			}
		},
		filterTableColumns(newTableColumns) {
			let cloneLocalTableColumns = cloneDeep(localTableColumns)
			cloneLocalTableColumns = cloneLocalTableColumns.map(function(item) {
				delete item.isHidden
				return item
			})
			if (!newTableColumns || newTableColumns.length === 0) {
				this.localTableConfig.columns = cloneLocalTableColumns
				return
			}

			newTableColumns.forEach(newCol => {
				let findedLocalCol = cloneLocalTableColumns.find(
					localCol =>
						newCol.props === localCol.props ||
						newCol.dataIndex === localCol.dataIndex // (查询dataIndex是为了支持最开始写法)
				)
				if (!findedLocalCol) {
					return console.warn(
						'canot find newCol: ' + JSON.stringify(newCol) + ' !'
					)
				}
				if (newCol.isHidden) {
					findedLocalCol.isHidden = true
				}
			})
			const targetColumns = cloneLocalTableColumns.filter(
				column => column.isHidden !== true
			)
			// 通过newTableColumns排序
			this.localTableConfig.columns = []
			newTableColumns.forEach(newCol => {
				targetColumns.forEach(tarCol => {
					if (
						newCol.props === tarCol.props ||
						newCol.dataIndex === tarCol.dataIndex
					) {
						this.localTableConfig.columns.push(tarCol)
					}
				})
			})
		},
		searchHandle(tableConfig, value) {
			if (tableConfig.searchBy.searchHandle) {
				tableConfig.searchBy.searchHandle(value)
			}
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = 'ztable-search'
				task.param = value || ''
				task.type = 'sendKey'
				task.time = '0'
				task.step = '表格搜索'
				this.$utt.setAsyncData(tableConfig.name)
				// this.$utt.asyncStartTime = new Date().getTime()
				// this.$utt.asyncModel = tableConfig.name
				this.$utt.addTask(task)
			}
		},
		handleTableChange(pagination, filters, sorter) {
			this.$emit('change', pagination, filters, sorter)
		}
	}
}
</script>

<style lang=less scope>
@import './style/index.less';

.ztable {
	padding: 24px 32px;
	background: white;
	border-radius: 4px;
}
.ztable__operate {
	display: flex;
	justify-content: space-between;
}
.ant-spin-blur {
	opacity: 0.2;
}
.ant-spin-blur::after {
	opacity: none;
}
.ant-spin-container:after {
	background: #f1f3f7;
	opacity: 0;
}
</style>
