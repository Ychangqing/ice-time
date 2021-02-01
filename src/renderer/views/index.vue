<template>
	<div id="wrapper">
		<a-row :gutter="16">
			<a-col :span="8" v-for="(item,index) in proList" :key="index">
				<a-card :title="item.name" :hoverable="true" :bordered="false" class="project-card">
					<template href="#" slot="extra">
						<a href="#">
							<a-icon
								:style="{'color': projectsStatus[item.path] === true ? 'red': ''}"
								@click="runProject(item.path)"
								:theme="projectsStatus[item.path] === 'loading' ? null : 'filled'"
								:type="getProjectStatus(item.path)"
							/>
						</a>
						<a href="#">
							<a-icon theme="filled" @click="openWithVSCode(item.path)" type="code" />
						</a>
						<a href="#">
							<a-icon theme="filled" type="delete" @click="deletePro(item._id)" />
						</a>
					</template>
					<p>路径：{{item.path}}</p>
					<p>端口：{{item.port}}</p>
					<p>分支：{{item.barnch}}</p>

					<a style="font-size:18px">
						<a-tooltip>
							<template slot="title">更新zenUI</template>
							<a-icon
								@click="updateZenUI(item.path)"
								:type="updateLoading[item.path] ? 'loading' : 'cloud-download'"
							/>
						</a-tooltip>
						<a-tooltip>
							<template slot="title">push代码</template>
							<a-icon type="branches" />
						</a-tooltip>
					</a>
				</a-card>
			</a-col>
		</a-row>
		<a-row :gutter="16">
			<a-col :span="8" class="project-card">
				<a-card
					@click="uploadFile"
					:hoverable="true"
					:bordered="false"
					style="text-align: center;font-size: 56px;color: #0c85ee;"
				>
					<a-icon type="plus-circle" />
				</a-card>
			</a-col>
		</a-row>
		<button @click="delAll">删除所有</button>
	</div>
</template>

<script>
const cloneDeep = require('lodash.clonedeep')
export default {
	data() {
		return {
			proList: [],
			projectsStatus: {},
			updateLoading: {}
		}
	},
	mounted() {
		this.$electron.ipcRenderer.invoke('DB_getAll').then(result => {
			this.proList = result
		})

		setInterval(() => {
			this.$electron.ipcRenderer
				.invoke('getProjectsStatu')
				.then(result => {
					this.projectsStatus = result
				})
		}, 10 * 1000)
	},
	methods: {
		uploadFile() {
			this.$electron.ipcRenderer.invoke('importPro').then(result => {
				this.proList = result
			})
		},
		delAll() {
			this.$electron.ipcRenderer.invoke('DB_deleall').then(result => {
				console.log('importPro', result)
			})
		},
		openWithVSCode(path) {
			this.$electron.ipcRenderer.invoke('openWithVSCode', path)
		},
		runProject(path) {
			if (!this.projectsStatus[path]) {
				let projectsStatus = cloneDeep(this.projectsStatus)
				projectsStatus[path] = 'loading'
				this.projectsStatus = projectsStatus
				this.$electron.ipcRenderer.invoke('runProject', path)
			}
			if (this.projectsStatus[path] === true) {
				this.$electron.ipcRenderer
					.invoke('stopProject', path)
					.then(res => {
						console.log(res)
					})
			}
		},
		getProjectStatus(path) {
			if (!this.projectsStatus[path]) {
				return 'play-circle'
			}
			if (this.projectsStatus[path] === 'loading') {
				return 'loading'
			}

			if (this.projectsStatus[path] === true) {
				return 'pause-circle'
			}
		},
		deletePro(proID) {
			this.$confirm({
				title: '确定删除这个项目吗?',
				content: '删除后不可恢复',
				onOk: () => {
					this.$electron.ipcRenderer
						.invoke('DB_delWithID', proID)
						.then(result => {
							console.log(result)
							this.proList = result.projectProcess
							this.projectsStatus = result.projectStatus
						})
				},
				onCancel: () => {},
				class: 'test'
			})
		},
		updateZenUI(path) {
			let updateLoading = cloneDeep(this.updateLoading)

			updateLoading[path] = true
			this.updateLoading = updateLoading

			this.$electron.ipcRenderer
				.invoke('updateZenUI', path)
				.then(res => {
					if (res) {
						updateLoading[path] = false
						this.updateLoading = updateLoading
						this.$message.success('更新成功！')
					}
				})
				.catch(err => {
					console.log(err)
					this.$message.info(path + '更新失败: ' + err)
					updateLoading[path] = false
					this.updateLoading = updateLoading
				})
		}
	}
}
</script>

<style lang="less">
#wrapper {
	padding: 24px;
}

.project-card {
	margin-bottom: 16px;
	.ant-card-extra {
		font-size: 16px !important;
	}
}
</style>>
