<template>
	<div class="ztabs" :class="`ztabs--${type}`">
		<div class="ztabs-container" onselectstart="return false" onselect="document.selection.empty()">
			<div
				v-for="(item, index) of tabs"
				:key="item.key || index"
				class="ztabs-tab"
				:class="[activeKey == (item.key || index) && 'ztabs-tab--active', item.disabled && 'ztabs-tab--disabled',sizeClassName]"
				@mousedown.right="onMousedownOfRight($event,item, index)"
				@click="onTabClick(item, index)"
				@contextmenu="contextmenu($event)"
			>
				<a-icon v-if="item.loading" type="loading" class="ztab--loading" @click.prevent.stop />
				<a-icon
					v-if="item.prefix"
					class="anticon--prefix"
					:type="item.prefix"
					@click.prevent.stop="onPrefixIconHandle(item)"
				/>
				{{ item.title }}
				<a-icon
					v-if="type === 'editable-card' && !item.unclosable"
					class="anticon--suffix"
					type="close"
					@click.prevent.stop="onClosable(item, index)"
				/>
			</div>
		</div>
		<mouse-menu
			ref="mouseMenu"
			:x="pageX"
			:y="pageY"
			v-show="visible"
			:visibile.sync="visible"
			:submenu="subMenu"
			:size="size"
			@change="onMouseMenuChange"
			@mouseleave="onChildMouseleave"
			@leave="onMouseMenuLeave"
		></mouse-menu>
		<mouse-menu
			v-show="subMenuIsvisible && subMenu.length"
			:visibile.sync="subMenuIsvisible"
			:x="pageX + offsetWidth"
			:y="pageY + offsetHeight"
			:size="size"
			:menus="subMenu"
			@change="onMouseSubMenuChange"
		></mouse-menu>
	</div>
</template>
<script>
import mouseMenu from './mouseMenu'
function isPromise(obj) {
	return 'function' == (obj && typeof obj.then)
}

export default {
	name: 'ztab',
	components: {
		mouseMenu
	},
	model: {
		prop: 'active'
	},
	props: {
		single: false,
		active: [String, Number],
		defaultActive: String,
		enableMouseMenu: {
			type: Boolean,
			default: false
		},
		mouseElement: {
			type: String,
			default: 'a'
		},
		type: {
			type: String,
			default: 'editable-card'
		},
		size: {
			type: String,
			default: 'medium'
		},
		tabs: {
			type: Array,
			default: () => []
		},
		beforeSwitch: Function,
		afterSwitch: Function,
		beforeMouseRightMenu: Function,
		afterMouseRightMenu: Function,
		beforeMouseRightSubMenu: Function,
		afterMouseRightSubMenu: Function,
		beforeClose: Function,
		afterClose: Function
	},
	computed: {
		subMenu() {
			let i,
				tabsMap = {},
				ret = []
			const tabs = this.tabs.reduce((item, next) => {
				if (Array.isArray(next.category) && next.category.length) {
					item.push(...next.category)
				} else if (
					typeof next.category === 'string' &&
					next.category.length
				) {
					item.push(next.category)
				}
				return item
			}, [])
			for (i = 0; i < tabs.length; i++) {
				if (!tabsMap[tabs[i]]) {
					tabsMap[tabs[i]] = tabs[i]
					ret.push(tabs[i])
				}
			}
			return ret
		},
		sizeClassName() {
			return `ztabs-tab--${this.size}`
		}
	},
	watch: {
		active(val) {
			this.activeKey = val
		},
		activeKey(val) {
			this.$emit('input', val)
		}
	},
	data() {
		let props = this.$props,
			active
		if (props.active != null) {
			active = props.active
		} else if (props.defaultActive != null) {
			active = props.defaultActive
		}
		return {
			pageX: null,
			pageY: null,
			visible: null,
			activeKey: active,
			loading: false,
			subMenuIsvisible: false,
			offsetHeight: 0,
			offsetWidth: 0
		}
	},
	created() {
		this.$root.pushTab = this.pushTab
		this.$root.unshiftTab = this.unshiftTab
	},
	mounted() {
		if (this.enableMouseMenu) {
			window.addEventListener('scroll', this.onScrollHandle)
			this.$nextTick(() => {
				this.mouse_menu = this.$refs.mouseMenu.$el
			})
		}
	},
	beforeDestory() {
		if (this.enableMouseMenu) {
			window.removeEventListener('scroll', this.onScrollHandle)
		}
	},
	methods: {
		onMouseMenuLeave() {
			this.visible = false
			this.subMenuIsvisible = false
		},
		operationTabs(tab, cb, method) {
			let index
			const hasAlerady = this.tabs.find((item, i) => {
				if (item.key === tab.key) {
					index = i
					return item
				}
			})
			if (hasAlerady) {
				this.activeKey = hasAlerady.key || index
				cb && cb()
			} else {
				this.tabs[method](tab)
				cb && cb(tab)
			}
		},
		pushTab(tab, cb) {
			this.operationTabs(tab, cb, 'push')
		},
		unshiftTab(tab, cb) {
			this.operationTabs(tab, cb, 'unshift')
		},
		onPrefixIconHandle(item) {
			this.$emit('prefix-icon-click', item, this.tabs)
		},
		onChildMouseleave() {
			setTimeout(() => {
				this.subMenuIsvisible = false
			}, 200)
		},
		onScrollHandle(e) {
			window.requestAnimationFrame(() => {
				let scrollTop =
					document.documentElement.scrollTop ||
					document.body.scrollTop
				if (this.visible) {
					if (!this.scrollTop) this.scrollTop = scrollTop
					if (
						scrollTop > this.scrollTop + 30 ||
						scrollTop < this.scrollTop - 30
					) {
						this.scrollTop = scrollTop
						this.visible = false
					}
				}
			})
		},
		// 系统鼠标右键菜单是否禁用
		contextmenu(e) {
			this.enableMouseMenu && e.preventDefault()
		},
		// 鼠标右键子菜单操作
		onMouseSubMenuChange(category) {
			let removeMaps = [],
				ret,
				before = this.beforeMouseRightSubMenu,
				after = this.afterMouseRightSubMenu,
				saveMaps
			//  过滤出需要保存的tabs
			if (category) {
				saveMaps = this.tabs.filter(item => {
					if (Array.isArray(item.category)) {
						if (item.category.indexOf(category) === -1) {
							return true
						} else {
							removeMaps.push(item)
						}
					} else if (typeof item.category === 'string') {
						if (category !== item.category) {
							return true
						} else {
							removeMaps.push(item)
						}
					} else {
						removeMaps.push(item)
					}
				})
			} else {
				saveMaps = this.tabs.filter(item => {
					if (Array.isArray(item.category) && item.category.length) {
						return item
					} else if (
						typeof item.category === 'string' &&
						item.category.length
					) {
						return item
					} else {
						removeMaps.push(item)
					}
				})
			}
			if (before) {
				if (isPromise(before)) {
					ret = before(category, removeMaps, saveMaps)
					ret.then(res => {
						if (res) {
							this.$emit('update:tabs', saveMaps)
						}
						after && after(category, removeMaps, saveMaps)
						this.subMenuIsvisible = false
						return res
					}).catch(err => {
						this.subMenuIsvisible = false
						after && after(category, removeMaps, saveMaps)
					})
				} else {
					before(category, removeMaps, saveMaps)
					ret && this.$emit('update:tabs', saveMaps)
					after && after(category, removeMaps, saveMaps)
					this.subMenuIsvisible = false
				}
			} else {
				this.$emit('update:tabs', saveMaps)
				this.subMenuIsvisible = false
			}
		},
		//  关闭事件
		onClosable(item, index) {
			debugger
			if (item.loading) return
			let active
			let key = item.key ? item.key : index
			if (key === this.activeKey) {
				const prevIndex = index - 1
				let prevTab = this.tabs[prevIndex]
				if (typeof prevTab === 'object') {
					while (prevTab.disabled) {
						prevTab = this.tabs[prevIndex - 1]
					}
				}
				active = item
				this.activeKey = prevTab.key || prevTab
			} else {
				active = this.tabs.find(
					(item, i) => (item.key || i) === this.activeKey
				)
			}
			if (this.beforeClose) {
				this.$set(item, 'loading', true)
				this.beforeClose({ ...item, active, remove: item }, () => {
					delete item.loading
					this.$emit(
						'update:tabs',
						this.tabs.filter((item, i) => (item.key || i) != key)
					)
				})
				this.afterClose && this.afterClose(item)
			} else {
				this.$emit(
					'update:tabs',
					this.tabs.filter((item, i) => (item.key || i) != key)
				)
				this.afterClose && this.afterClose(item)
			}
		},
		// 每个tab的点击
		onTabClick(item, i) {
			if (item.disabled) return
			if (item.loading) return
			if (this.single) {
				const hasAlerady = this.tabs.some(item => item.loading)
				if (hasAlerady) return
			}
			let key = item.key || i
			this.$set(item, 'loading', true)
			if (!this.beforeSwitch) {
				this.activeKey = key
				this.$emit('input', key)
				this.$emit('change', item)
				delete item.loading
				this.afterSwitch && this.afterSwitch(item)
				return
			}
			this.beforeSwitch(item, () => {
				this.activeKey = key
				this.$emit('input', key)
				delete item.loading
				this.$emit('change', item)
				this.afterSwitch && this.afterSwitch(item)
			})
		},
		// 鼠标右键点击
		onMousedownOfRight(e, item, index) {
			if (item.unclosable || item.disabled) return
			if (!this.enableMouseMenu) return
			this.currentKey = item.key || index
			this.currentTab = item
			this.currentTabIndex = index
			this.visible = true
			this.$nextTick(() => {
				const rect = e.target.getBoundingClientRect()
				this.pageX = rect.left + (e.pageX - rect.left)
				this.pageY = rect.top + rect.height
				this.offsetHeight = this.mouse_menu.offsetHeight - 30
				this.offsetWidth = this.mouse_menu.offsetWidth + 12
			})
		},
		// 鼠标右键菜单每个item的点击
		onMouseMenuChange(type, item, index) {
			let ret,
				modelHandle,
				category,
				before = this.beforeClose,
				after = this.afterClose,
				active,
				result
			let key = index != null ? index : this.currentKey
			let currentTab = item ? item : this.currentTab
			let executeAfterRightMenu = asyncInfo => {
				after && after(this.currentTab, asyncInfo)
			}
			this.$set(currentTab, 'loading', true)
			function filterTheNotClose(tabs, index, position) {
				let update = [],
					remove = []
				if (position == 'right') {
					update = tabs.filter((item, i) => {
						if (i <= index || item.disabled || item.unclosable) {
							return item
						}
						remove.push(item)
					})
				} else if (position === 'left') {
					update = tabs.filter((item, i) => {
						if (i >= index || item.disabled || item.unclosable) {
							return item
						}
						remove.push(item)
					})
				} else {
					update = tabs.filter((item, i) => {
						if (item.disabled || item.unclosable || i === index) {
							return item
						}
						remove.push(item)
					})
				}
				return { update, remove }
			}
			switch (type) {
				case 1001:
					let removeIndex
					const tabs = this.tabs.filter((item, i) => {
						if ((item.key || i) != key) {
							return item
						} else {
							removeIndex = i
						}
					})
					if (this.activeKey === key) {
						const prevTab = tabs[removeIndex - 1]
						this.activeKey = prevTab.key || prevTab
						active = prevTab
					} else {
						active = tabs.find(
							(item, i) =>
								this.activeKey === item.key ||
								this.activeKey === i
						)
					}
					modelHandle = () => {
						delete currentTab.loading
						this.$emit('update:tabs', tabs)
					}
					if (!before) {
						modelHandle()
						executeAfterRightMenu()
						return
					}
					before(
						{ ...currentTab, active, remove: currentTab, type },
						(...res) => {
							modelHandle()
							executeAfterRightMenu(...res)
						}
					)
					break
				case 1002:
					this.activeKey = key
					result = filterTheNotClose(this.tabs, this.currentTabIndex)
					modelHandle = () => {
						delete currentTab.loading
						this.$emit('update:tabs', result.update)
					}
					if (!before) {
						modelHandle()
						executeAfterRightMenu()
						return
					}
					before(
						{
							...this.currentTab,
							active: currentTab,
							remove: result.remove,
							type
						},
						(...res) => {
							modelHandle()
							executeAfterRightMenu(...res)
						}
					)
					break
				case 1003:
					result = filterTheNotClose(
						this.tabs,
						this.currentTabIndex,
						'right'
					)
					if (this.activeKey !== key) this.activeKey = key
					modelHandle = () => {
						delete currentTab.loading
						this.$emit('update:tabs', result.update)
					}
					if (!before) {
						modelHandle()
						executeAfterRightMenu()
						return
					}
					before(
						{
							...this.currentTab,
							active: currentTab,
							remove: result.remove,
							type
						},
						(...res) => {
							modelHandle()
							executeAfterRightMenu(...res)
						}
					)
					break
				case 1004:
					result = filterTheNotClose(
						this.tabs,
						this.currentTabIndex,
						'left'
					)
					if (this.activeKey !== key) this.activeKey = key
					modelHandle = () => {
						delete currentTab.loading
						this.$emit('update:tabs', result.update)
					}
					if (!before) {
						modelHandle()
						executeAfterRightMenu()
						return
					}
					before(
						{
							...this.currentTab,
							active: currentTab,
							remove: result.remove,
							type
						},
						(...res) => {
							modelHandle()
							executeAfterRightMenu(...res)
						}
					)
					break
				case 1005:
					result = filterTheNotClose(this.tabs)
					this.activeKey = this.tabs[0].key || this.tabs[0]
					modelHandle = () => {
						delete currentTab.loading
						this.$emit('update:tabs', result.update)
					}
					if (!before) {
						modelHandle()
						executeAfterRightMenu()
						return
					}
					before(
						{
							...this.currentTab,
							active: this.tabs[0],
							remove: result.remove,
							type
						},
						(...res) => {
							modelHandle()
							executeAfterRightMenu(...res)
						}
					)
					break
				case 1006:
					if (this.subMenu.length === 1) {
						this.onMouseSubMenuChange()
					} else {
						this.subMenuIsvisible = true
					}
					if (this.activeKey === key) {
						this.activeKey = this.tabs[0].key || this.tabs[0]
					}
					break
			}
			if (!this.subMenuIsvisible) this.visible = false
		}
	}
}
</script>
<style lang=less>
@import './style/index.less';
</style>
