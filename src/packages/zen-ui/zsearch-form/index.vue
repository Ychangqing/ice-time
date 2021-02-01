<template>
	<div class="zsearch-form">
		<div class="zsearch-form__top">
			<a-row type="flex" justify="space-between" align="middle">
				<a-col :span="8">
					<h2 v-if="config.title">{{config.title}}</h2>
				</a-col>
				<a-col :span="16">
					<div class="btns">
						<slot name="titleRight"></slot>
					</div>
				</a-col>
			</a-row>
		</div>
		<div class="zsearch-form__searchinput">
			<a-row type="flex" justify="space-between" align="middle">
				<a-col :span="12">
					<a-input-search
						v-model="searchInputVal"
						:id="config.name + '_search_input'"
						@search="(value, e) => {blurHandle(config.name + '_search_input');clickHandle(e, 'inputSearch')}"
						:placeholder="input.placeholder ? $locale.fuzzySearch + input.placeholder : ''"
					>
						<a-button :id="config.name + '_search_btn'" type="primary" slot="enterButton">
							<a-icon type="search" />
						</a-button>
					</a-input-search>
				</a-col>
				<a-col :span="12">
					<div class="btns">
						<a
							href="javascript:void(0)"
							:id="config.name + '_change_search_btn'"
							@click="(e) => clickHandle(e, 'expandSearchfiledsHandle')"
							v-if="searchBar && searchBar.columns.length > 0"
						>{{!expandSearchfileds ? $locale.searchMore:$locale.Search}}</a>
						<slot name="btns"></slot>
						<a-button
							:id="config.name + '_open_modal_btn'"
							icon="setting"
							v-if="columns"
							@click="(e) => clickHandle(e, 'openModal')"
						/>
						<a-button
							icon="reload"
							v-if="config.refreshBtn"
							:id="config.name + '_refresh_btn'"
							@click="(e) => clickHandle(e, 'refreshHandle')"
						/>
						<a-button
							type="primary"
							v-if="config.addBtn"
							:id="config.name + '_add_handle_btn'"
							@click="(e) => clickHandle(e, 'addHandle')"
						>{{config.addBtn.text || $locale.addNew}}</a-button>
					</div>
				</a-col>
			</a-row>
		</div>
		<div class="zsearch-form__searchvalues" v-if="!!searchItems.length">
			<span>{{$locale.filter}}</span>
			<template v-for="(item,index) in searchItems">
				<a-tag
					closable
					v-if="item.value"
					:key="item.props"
					:id="config.name + '_add_close_tag' + index"
					@close="removeSearchItem(index,item, config.name + '_add_close_tag' + index)"
				>
					{{item.label}}
					<span v-if="item.label">:</span>
					{{item.selectText || item.value}}
				</a-tag>
			</template>
		</div>
		<div class="zsearch-form__searchfileds" v-show="expandSearchfileds">
			<zform ref="zform" :formConfig="searchBar" :formData="formData"></zform>
		</div>

		<zmodal
			:visible="visible"
			@handleCancel="cancelHandle"
			:title="$locale.customizeFormList"
			:width="600"
		>
			<a-checkbox-group v-model="checkedList" @change="checkboxChangeHandal">
				<a-row>
					<draggable :list="columns" class="list-group" @end="dragEndHandle">
						<a-col
							:span="8"
							v-for="(item,index) in columns"
							:key="index"
							style="margin-bottom:8px"
							class="list-group-item"
						>
							<a-checkbox
								:id="config.name + '_'"
								:value="item.props"
								:disabled="item.disabledChecked"
								@click="clickTask(index, item, item, `checkbox选择值-${item.label}`, 'div/div/')"
							>{{item.title}}</a-checkbox>
						</a-col>
					</draggable>
				</a-row>
			</a-checkbox-group>
			<template slot="footer">
				<a-button id="ant-modal-reset" key="reset" @click="resetHandle">{{$locale.clear}}</a-button>
				<a-button id="ant-modal-cancel" key="back" @click="cancelHandle">{{$locale.cancel}}</a-button>
				<a-button id="ant-modal-ok" key="submit" type="primary" @click="okHandle">{{$locale.ok}}</a-button>
			</template>
		</zmodal>

		<!-- <zsmodal
			:visible="visible"
			title="自定义表单列"
			@handleOk="okHandle"
			@handleCancel="cancelHandle"
			:columns="columns"
		></zsmodal>-->
	</div>
</template>

<script>
// import zsmodal from '../z-smodal/index.vue'
var cloneDeep = require('lodash.clonedeep')
import draggable from 'vuedraggable'
const handalNamePath = {
	inputSearch: '模糊搜索按钮',
	expandSearchfiledsHandle: '搜索模式切换',
	openModal: '表格列配置弹框',
	refreshHandle: '刷新按钮',
	addHandle: '新增按钮'
}

export default {
	name: 'zsearchForm',
	components: {
		//zsmodal
		draggable
	},
	data() {
		return {
			size: 'small',
			searchInputVal: '',
			expandSearchfileds: false,
			searchItems: [],
			searchItemsMap: {},
			formColumnsMap: {},
			formData: {},
			visible: false,
			checkedList: [],
			columnsMap: {},
			searchBarClone: null
		}
	},
	props: {
		input: {
			type: Object,
			default: function() {
				return {}
			}
		},
		config: {
			type: Object,
			default: function() {
				return {}
			}
		},
		searchBar: {
			type: Object,
			default: function() {
				return { columns: [] }
			}
		},
		searchBarData: {
			type: Object,
			default: function() {
				return {}
			}
		},
		columns: {
			type: Array
		},
		showAddBtn: {
			type: Boolean,
			default: true
		},
		defaultSearchItems: {
			type: Array
		}
	},
	watch: {
		searchItems(newVal) {
			// 执行map操作
			this.searchItemsMap = this.transformToMap(this.searchItems, 'props')
			// 发起查询请求
			this.$emit('change', newVal)
		},
		searchBarData(newVal) {
			this.filterSearchItem(newVal)
			this.formData = newVal
		}
	},
	mounted() {
		let {
			searchBarData,
			searchBar,
			input,
			columns,
			formColumnsMap,
			config
		} = this
		if (!config.name) {
			config.name = 'zsearch_form'
		}
		if (searchBar) {
			this.searchBarClone = cloneDeep(this.searchBar)
			this.formColumnsMap = this.transformToMap(
				this.searchBar.columns,
				'props'
			)
			formColumnsMap = this.formColumnsMap
		}

		let defaultSearchItems = []
		if (input && input.filed && input.filed.value) {
			this.searchInputVal = input.filed.value
			defaultSearchItems.push(input.filed)
		}
		// 判断表单是否有默认搜索条件
		if (
			searchBarData &&
			JSON.stringify(searchBarData) !== '{}' &&
			searchBarData.columns.length > 0
		) {
			this.formData = searchBarData
			//this.filterSearchItem(searchBarData)
			this.expandSearchfileds = true

			for (var i in searchBarData) {
				if (searchBarData[i]) {
					defaultSearchItems.push({
						props: i,
						label: formColumnsMap[i].label,
						value: searchBarData[i]
					})
				}
			}
		}
		if (!!defaultSearchItems.length) {
			this.searchItems = defaultSearchItems
		}
		if (columns) {
			this.columnsMap = this.transformToMap(this.columns, 'props')
			this.checkedList = []
			columns.forEach(item => {
				if (!item.isHidden) {
					this.checkedList.push(item.props)
				}
			})
		}
	},
	methods: {
		clickTask(index, item, column, step, path) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				const task = {
					by_select: 'XPath',
					by_val:
						path === false
							? `//*[@id="${column.props}"]`
							: `//*[@id="${column.props}"]/${path ||
									''}label[${index + 1}]`,
					param: item.label || item.title,
					type: 'click',
					time: '0',
					step: step
				}
				this.$utt.addTask(task)
			}
		},
		blurHandle(id) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = `${id}`
				task.param = `${this.searchInputVal}`
				task.type = 'sendKey'
				task.time = '0'
				task.step = `修改搜索框input值`
				this.$utt.addTask(task)
			}
		},
		clickHandle(e, handal) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = `${e.target.id}`
				task.type = 'click'
				task.step = handalNamePath[handal] || '点击事件'
				this.$utt.addTask(task)
			}
			if (handal) {
				this[handal]()
			}
		},
		checkboxChangeHandal(checkedValue) {
			let filterRes = this.filterSearchBar()
			if (this.searchBar) {
				this.searchBar.columns = filterRes.searchBarCloneColumns
				this.$nextTick(() => {
					let values = this.$refs.zform.form.getFieldsValue()
					let filterValues = {}
					for (const key in values) {
						let findedItem = filterRes.searchBarCloneColumns.find(
							item => item.props === key
						)
						if (findedItem) {
							filterValues[key] = values[key]
						}
					}
					this.formData = filterValues
					this.filterSearchItem(filterValues)
					// this.$emit('change', this.searchItems)
					this.$emit('columnsChange', filterRes.newColumns)
				})
			} else {
				// this.$emit('change', this.searchItems)
				this.$emit('columnsChange', filterRes.newColumns)
			}
		},
		resetHandle() {
			this.checkedList = []
			this.columns.forEach(item => {
				if (item.disabledChecked) {
					this.checkedList.push(item.props)
				}
			})
			let filterRes = this.filterSearchBar()
			if (this.searchBar) {
				this.searchBar.columns = filterRes.searchBarCloneColumns
				this.$nextTick(() => {
					let values = this.$refs.zform.form.getFieldsValue()
					let filterValues = {}
					for (const key in values) {
						let findedItem = filterRes.searchBarCloneColumns.find(
							item => item.props === key
						)
						if (findedItem) {
							filterValues[key] = values[key]
						}
					}
					this.formData = filterValues
					this.filterSearchItem(filterValues)
					this.$emit('change', this.searchItems)
					this.$emit('columnsChange', filterRes.newColumns)
				})
			} else {
				this.$emit('change', this.searchItems)
				this.$emit('columnsChange', filterRes.newColumns)
			}
			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				let task = {}
				task.by_select = 'id'
				task.by_val = 'ant-modal-reset'
				task.param = 'Reset'
				task.type = 'click'
				task.time = '0'
				task.step = '点击reset按钮'
				this.$utt.addTask(task)
			}
		},
		expandSearchfiledsHandle() {
			this.expandSearchfileds = !this.expandSearchfileds
		},
		removeSearchItem(index, item, parentId) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `XPath`
				task.by_val = `//*[@id="${parentId}"]/i`
				task.type = 'click'
				task.step = '删除高级搜索tag按钮'
				this.$utt.addTask(task)
			}

			this.searchItems.splice(index, 1)
			let props =
				(this.input.filed && this.input.filed.props) || 'defaultValue'
			if (props === item.props) {
				this.searchInputVal = ''
			} else {
				this.formData[item.props] = null
				//delete this.formData[item.props]
			}
		},
		inputSearch() {
			let { searchInputVal } = this
			let props =
				(this.input.filed && this.input.filed.props) || 'defaultValue'
			let label =
				(this.input.filed && this.input.filed.label) ||
				this.$locale.fuzzySearch
			if (this.searchItemsMap[props]) {
				this.searchItems = this.searchItems.map(item => {
					if (item.props === props) {
						item.value = searchInputVal
					}
					return item
				})
			} else {
				this.searchItems.push({
					props: props,
					label: label,
					value: searchInputVal
				})
			}
		},
		filterSearchItem(values) {
			// 保留默认搜索条件
			let { formColumnsMap } = this
			let searchItems = []
			let props =
				(this.input.filed && this.input.filed.props) || 'defaultValue'
			searchItems = this.searchItems.filter(item => {
				if (item.props === props) {
					return item
				}
			})
			for (var i in values) {
				let value = cloneDeep(values[i])
				if (!value || value.length === 0) {
					continue
				}
				let selectText = null
				if (formColumnsMap[i].type === 'select') {
					let finded = formColumnsMap[i].options.find(
						item => item.value === value
					)
					if (finded) {
						selectText = finded.text
					}
				}

				if (formColumnsMap[i].type === 'datepicker') {
					selectText =
						value[0].format('YYYY-MM-DD HH:mm:ss') +
						' ~ ' +
						value[1].format('YYYY-MM-DD HH:mm:ss')
				}

				searchItems.push({
					props: i,
					label: formColumnsMap[i].label,
					value: values[i],
					selectText: selectText
				})
			}
			this.searchItems = searchItems
		},
		transformToMap(source, key) {
			if (!Array.isArray(source)) {
				return
			}
			let result = {}
			source.forEach(item => {
				if (item[key]) {
					result[item[key]] = item
				}
			})
			return result
		},
		openModal() {
			this.visible = true
		},
		okHandle() {
			let filterRes = this.filterSearchBar()

			this.visible = false
			if (this.searchBar) {
				this.searchBar.columns = filterRes.searchBarCloneColumns
				this.$nextTick(() => {
					let values = this.$refs.zform.form.getFieldsValue()
					let filterValues = {}
					for (const key in values) {
						let findedItem = filterRes.searchBarCloneColumns.find(
							item => item.props === key
						)
						if (findedItem) {
							filterValues[key] = values[key]
						}
					}
					this.formData = filterValues
					this.filterSearchItem(filterValues)
					this.$emit('columnsChange', filterRes.newColumns)
				})
			} else {
				this.$emit('columnsChange', filterRes.newColumns)
			}
			if (this.$utt && this.$utt.isRunning) {
				//添加uitest日志
				let task = {}
				task.by_select = 'id'
				task.by_val = 'ant-modal-ok'
				task.param = 'OK'
				task.type = 'click'
				task.time = '0'
				task.step = '点击确定按钮'
				this.$utt.addTask(task)
			}
		},
		filterSearchBar() {
			let formResult = this.checkedList
			let newColumns = []
			let searchBarCloneColumns = []
			if (this.searchBarClone) {
				searchBarCloneColumns = cloneDeep(this.searchBarClone.columns)
			}
			this.columns.forEach(item => {
				let result = false
				if (formResult.indexOf(item.props) > -1) {
					result = true
				} else {
					let searchIndex = searchBarCloneColumns.findIndex(
						column => {
							return column.props === item.props
						}
					)
					if (searchIndex > -1) {
						searchBarCloneColumns.splice(searchIndex, 1)
					}
				}
				item.isHidden = result ? false : true
				newColumns.push(item)
			})
			return { searchBarCloneColumns, newColumns }
		},
		cancelHandle(e) {
			this.visible = false
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
					task.by_val = 'ant-modal-cancel'
					task.param = 'Cancel'
					task.step = '点击cancel按钮'
					this.$utt.addTask(task)
				}
			}
		},
		addHandle() {
			let { url, clickHandle } = this.config.addBtn
			if (url) {
				this.$router.push(url)
				return
			}
			if (clickHandle) {
				clickHandle()
			}
		},
		refreshHandle() {
			let { clickHandle } = this.config.refreshBtn
			if (clickHandle) {
				clickHandle()
				return
			}
		},
		dragEndHandle() {
			let afterDragChekedList = []
			this.columns.forEach(column => {
				this.checkedList.forEach(check => {
					if (check === column.props) {
						afterDragChekedList.push(check)
					}
				})
			})
			this.checkedList = afterDragChekedList
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost'
			}
		}
	}
}
</script>
<style lang=less>
@import './style/index.less';
</style>
