<template>
	<a-layout class="zen-layout-trigger">
		<a-layout-sider
			id="zen-layout-sider"
			:style="siderStyle"
			:theme="configData.sider.theme"
			:collapsible="configData.sider.collapsible"
			:class="layoutClass"
			width="180px"
			collapsedWidth="56px"
			v-model="collapsed"
			v-if="configData.sider"
		>
			<div class="zen-layout--logo" id="zen-layout--logo" :style="lineHeightStyle">
				<slot name="logo"></slot>
			</div>
			<menuItem
				:mode="configData.sider.mode || 'inline'"
				:theme="configData.sider.theme || 'dark'"
				:data="configData"
				:debuggerEnv="configData.debuggerEnv || false"
				type="sider"
				:style="{maxHeight: menuHeight,minHeight: menuHeight}"
				@menuHandle="menuHandle"
				@getRouteInfo="getRouteInfo"
				v-if="configData.sider.menu && !!configData.sider.menu.length"
			></menuItem>
		</a-layout-sider>
		<a-layout :style="headerWrapStyle">
			<a-layout-header :class="headerClass" :style="headerStyle" v-if="configData.header">
				<div class="zen-layout--header">
					<a-icon
						class="trigger"
						:style="lineHeightStyle"
						:type="collapsed ? 'menu-unfold' : 'menu-fold'"
						@click="()=> collapsed = !collapsed"
						v-if="configData.sider && configData.sider.showCollapsed"
					/>
					<div class="zen-layout--logo" id="zen-layout--logo" :style="lineHeightStyle">
						<slot name="headerLogo"></slot>
					</div>
					<menuItem
						:style="lineHeightStyle"
						mode="horizontal"
						:theme="configData.header.theme || 'dark'"
						:data="configData"
						type="header"
						@menuHandle="menuHandle"
						@getRouteInfo="getRouteInfo"
						v-if="configData.header.menu && !!configData.header.menu.length"
					></menuItem>
					<ul
						class="zen-layout-menu--header"
						:style="lineHeightStyle"
						v-if="configData.header && configData.header.list && !!configData.header.list.length"
					>
						<slot name="menuHeader" v-for="val in configData.header.list" :text="val"></slot>
					</ul>
				</div>
			</a-layout-header>
			<a-layout-content :style="{'margin-top': headerHeight}">
				<div style="clear: both;display: block;width: 100%;height: auto;">
					<slot name="content"></slot>
				</div>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script>
import menuItem from './menu.vue'
export default {
	props: ['configData'],
	name: 'zlayout',
	components: {
		menuItem
	},
	data() {
		return {
			collapsed:
				this.configData.sider && this.configData.sider.collapsed
					? this.configData.sider.collapsed
					: null,
			currentItem: {},
			siderWidth: 0,
			headerHeight: 0,
			selectedKeys: null,
			menuHeight: null
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (
				this.configData.fixed &&
				this.configData.fixed.includes('header')
			) {
				this.headerHeight = (this.configData.lineHeight || 64) + 'px'
			}
			this.watchResize()
		})
	},
	methods: {
		watchResize() {
			this.setCollapsed()
			const logoAndColHeight = this.configData.sider.collapsible
				? document.getElementById('zen-layout--logo').clientHeight + 48
				: 48 + 15

			this.menuHeight =
				document.body.clientHeight - logoAndColHeight + 'px'
			window.onresize = () => {
				this.setCollapsed()
				this.menuHeight =
					document.body.clientHeight - logoAndColHeight + 'px'
			}
		},
		setCollapsed() {
			if (document.body.clientWidth > 980) {
				this.collapsed = false
			} else {
				this.collapsed = true
			}
		},
		menuHandle(e, type) {
			if (this.configData[type].onClickMenu != undefined) {
				this.configData[type].onClickMenu(e)
			}
			this.handleClick(e)
		},
		filterMemu(list, key) {
			this.currentItem = {}
			this.currentItem = list.find(ele => ele.key == key)
		},
		handleClick(e) {
			for (let i = e.keyPath.length - 1; i >= 0; i--) {
				let arr = []
				if (i == e.keyPath.length - 1) {
					arr = this.itemList
				} else {
					if (this.currentItem.children) {
						arr = this.currentItem.children
					} else {
						arr.push(this.currentItem)
					}
				}
				this.filterMemu(arr, e.keyPath[i])
			}
			if (this.currentItem && this.currentItem.url) {
				this.$nextTick(() => {
					this.$router.push(this.currentItem.url)
				})
			}
		},
		getRouteInfo(parentKey, column) {
			this.$emit('change-route', parentKey, column)
		}
	},
	computed: {
		itemList: function() {
			return this.configData.sider && this.configData.sider.menu
				? this.configData.sider.menu
				: null
		},
		layoutClass: function() {
			return {
				'zen-layout': true,
				'zen-layout--menu__fixed__left':
					this.configData.fixed &&
					this.configData.fixed.includes('sider')
			}
		},
		headerClass: function() {
			return {
				'zen-layout--menu__fixed__top':
					this.configData.fixed &&
					this.configData.fixed.includes('header'),
				'zen-layout--header__light':
					this.configData.header.theme == 'light'
			}
		},
		siderStyle: function() {
			return {
				zIndex:
					this.configData.fixed &&
					this.configData.fixed.includes('sider')
						? 100
						: 1
			}
		},
		headerWrapStyle: function() {
			return {
				minHeight: this.configData.fixed ? '100vh' : '200px',
				paddingLeft:
					this.configData.fixed &&
					this.configData.fixed.includes('sider')
						? this.siderWidth
						: 'auto'
			}
		},
		headerStyle: function() {
			return {
				height: (this.configData.lineHeight || 64) + 'px',
				width: this.configData.sider
					? this.configData.fixed &&
					  this.configData.fixed.includes('header')
						? 'calc(100% - ' + this.siderWidth
						: 'auto'
					: '100%',
				right: 0,
				top: 0
			}
		},
		lineHeightStyle: function() {
			return {
				height: (this.configData.lineHeight || 64) + 'px',
				lineHeight: (this.configData.lineHeight || 64) + 'px'
			}
		}
	},
	watch: {
		collapsed: {
			handler: function(newValue) {
				if (this.configData.fixed) {
					if (newValue) {
						this.$nextTick(() => {
							this.siderWidth = '56px'
						})
					} else {
						this.$nextTick(() => {
							setTimeout(() => {
								this.siderWidth = '180px'
							}, 300)
						})
					}
				}
			},
			immediate: true
		}
	}
}
</script>
<style lang=less>
@import 'style/index.less';
</style>
