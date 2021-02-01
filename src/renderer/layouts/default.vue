
<template>
	<div id="app">
		<div class="layout-content">
			<div class="sider-content">
				<a>
					<a-icon style="fontSize: 24px" type="database" />
					<span>项目</span>
				</a>
				<a @click="test()">
					<a-icon style="fontSize: 24px" type="file-search" />
					<span>字典</span>
				</a>
			</div>
			<div class="main-content">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'defaultLayout',
	methods: {
		test() {
			this.$router.push({ path: 'test' })
		}
	}
}
</script>

<style>
.layout-content {
	display: flex;
	width: 100%;
	height: 100%;
	background: #ffffff;
}
.sider-content {
	display: flex;
	flex-direction: column;
	color: white;
	height: 100vh;
	overflow: auto;
	background: #0c85ee;
}
.sider-content a {
	width: 78px;
	display: flex;
	flex-direction: column;
	text-align: center;
	margin-top: 32px;
	color: #ffffff;
	font-weight: bold;
	padding: 8px 0px;
}

.sider-content a:hover {
	background: #004ba1;
}

.sider-content a span {
	margin-top: 8px;
}

.main-content {
	flex: 1;
	height: 100vh;
	overflow: auto;
	background: #f5f5f5;
}
</style>
