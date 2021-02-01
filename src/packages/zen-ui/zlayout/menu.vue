<template>
	<a-menu
		:mode="mode"
		:theme="theme"
		:selectedKeys="selectedKeys"
		:openKeys.sync="openKeys"
		@openChange="menuChange($event)"
		@click="$emit('menuHandle', $event, type)"
	>
		<template v-for="item in data[type].menu">
			<a-menu-item :disabled="item.disabled" v-if="!item.children" :key="item.key">
				<i class="anticon zen-menu--anticon" v-if="item.iconUrl.includes('svg')">
					<img :src="require('./' + item.iconUrl)" class="zen-menu--anticon--img" />
				</i>
				<a-icon v-else :type="item.iconUrl" />
				<span class="zen-menu--title">
					<i v-text="item.title"></i>
					<img v-if="showNewIcon(item)" :src="require('./new-icon.svg')" />
				</span>
			</a-menu-item>
			<a-sub-menu :disabled="item.disabled" v-else :key="item.key">
				<span slot="title">
					<i class="anticon zen-menu--anticon" v-if="item.iconUrl.includes('svg')">
						<img :src="require('./' + item.iconUrl)" class="zen-menu--anticon--img" />
					</i>
					<a-icon v-else :type="item.iconUrl" />
					<span class="zen-menu--title">
						<i v-text="item.title"></i>
						<img v-if="showNewIcon(item)" :src="require('./new-icon.svg')" />
					</span>
				</span>
				<template v-for="childrenItem in item.children">
					<a-menu-item
						:disabled="childrenItem.disabled"
						v-if="!childrenItem.children"
						:key="childrenItem.key"
					>
						<span class="zen-menu--title">
							<i v-text="childrenItem.title"></i>
							<img v-if="showNewIcon(childrenItem)" :src="require('./new-icon.svg')" />
						</span>
					</a-menu-item>
					<a-sub-menu :disabled="childrenItem.disabled" v-else :key="childrenItem.key">
						<span class="zen-menu--title" slot="title">
							<i v-text="childrenItem.title"></i>
							<img v-if="showNewIcon(childrenItem)" :src="require('./new-icon.svg')" />
						</span>
						<a-menu-item v-for="nodeItem in childrenItem.children" :key="nodeItem.key">
							<span class="zen-menu--title">
								<i v-text="nodeItem.title"></i>
								<img v-if="showNewIcon(nodeItem)" :src="require('./new-icon.svg')" />
							</span>
						</a-menu-item>
					</a-sub-menu>
				</template>
			</a-sub-menu>
		</template>
	</a-menu>
</template>

<script>
export default {
	name: '',
	props: ['data', 'mode', 'theme', 'type', 'debuggerEnv', 'defaultOpenKeys'],
	data() {
		return {
			selectedKeys: null,
			openKeys: [], // menu展开数组
			openKeysRepeat: [], //
			getOpenKeys: false // 找到等于path的url布尔值
		}
	},
	methods: {
		/**
		 * parent menu list
		 * path url
		 * lev menu层级
		 */
		getCurrentMenu(parent, path, lev) {
			const list = parent.children || parent
			for (var item of list) {
				this.openKeysRepeat.splice(
					lev - 1,
					this.openKeysRepeat.length - 1,
					item.key
				)
				if (item.url && item.url == path) {
					this.openKeysRepeat.forEach(key => {
						if (Array.isArray(this.openKeys)) {
							if (!this.openKeys.includes(key)) {
								this.openKeys.push(key)
							}
						} else {
							this.openKeys = [...this.openKeysRepeat]
						}
					})
					this.getOpenKeys = true
					if (!!this.selectedKeys) {
						this.selectedKeys.splice(0, 1, item.key)
					} else {
						this.selectedKeys = [item.key]
					}

					const column = JSON.parse(JSON.stringify(item))
					Object.assign(column, { module: parent.module || '' })
					this.$emit('getRouteInfo', {
						parentKey: parent.key || '',
						column: column
					})
					break
				}
				if (item.children) {
					this.getCurrentMenu(
						item,
						path,
						item == list[length - 1] ? lev - 1 : lev + 1
					)
				}
			}
		},
		async contructStatus(path) {
			await this.$nextTick(() => {
				const arr = [
					...(this.data.sider && this.data.sider.menu
						? this.data.sider.menu
						: []),
					...(this.data.header && this.data.header.menu
						? this.data.header.menu
						: [])
				]
				if (arr && !!arr.length) {
					this.getCurrentMenu(arr, path, 1)
				}
			})
		},
		menuChange(e) {
			this.openKeys = [...e]
		},
		showNewIcon(column) {
			if (column.moduleUid && column.parentUid && this.debuggerEnv) {
				return true
			} else {
				return false
			}
		}
	},
	watch: {
		$route: {
			handler: function(newValue) {
				this.openKeysRepeat = []
				this.getOpenKeys = false
				this.contructStatus(newValue.fullPath).then(() => {
					if (!this.getOpenKeys) {
						this.$emit('getRouteInfo', -1, newValue.fullPath)
					}
				})
			},
			immediate: true
		}
	}
}
</script>
<style lang=less>
</style>
