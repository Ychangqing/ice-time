<template>
	<div
		:style="{'left': x + 'px', 'top': y + 'px'}"
		class="zmouse-menus"
		@mouseleave="$emit('leave')"
	>
		<div
			class="zmouse-menu"
			v-for="(item, index) of newMenus"
			:class="[sizClassName, currentIndex == index && 'zmouse-menu--acitve']"
			:key="item.type || item"
			@click.stop="onMouseMenuClick(item.type || item, index)"
		>{{item.title || item}}</div>
		<!-- <div
			v-if="this.submenu && this.submenu.length"
			class="zmouse-menu"
			:class="[sizClassName, currentIndex == 4 && 'zmouse-menu--acitve',currentIndex == 4 && 'zmouse-menu--save']"
			@click.stop="onMouseMenuClick(1006, 4)"
		>{{$locale.saveSameCategory}}</div>-->
	</div>
</template>
<script>
export default {
	name: 'ZMouseMenu',
	props: {
		x: Number,
		y: Number,
		size: String,
		visibile: Boolean,
		submenu: Array
	},
	computed: {
		sizClassName() {
			return `zmouse-menus--${this.size}`
		},
		newMenus() {
			return (
				this.menus || [
					{ title: this.$locale.close, type: 1001 },
					{ title: this.$locale.closeOthers, type: 1002 },
					{ title: this.$locale.closeToTheRight, type: 1003 },
					{ title: this.$locale.closeToTheLeft, type: 1004 },
					{ title: this.$locale.closeAll, type: 1005 }
				]
			)
		}
	},
	watch: {
		visibile(val) {
			if (!val) this.currentIndex = null
		}
	},
	data() {
		return {
			currentIndex: null
		}
	},
	methods: {
		onClickOutSide() {
			this.$emit('update:visibile', false)
		},
		onMouseMenuClick(type, index) {
			this.currentIndex = index
			this.$emit('change', type)
		}
	}
}
</script>
