<template>
	<div>
		<a-tooltip
			placement="topLeft"
			slot="headerSlot"
			v-if="!$utt.isRunning"
			@click.stop="playHandle"
			class="mr12"
		>
			<template slot="title">
				<span>开始记录</span>
			</template>
			<a-icon type="play-circle" style="font-size:20px;"></a-icon>
		</a-tooltip>
		<a-tooltip
			placement="topLeft"
			slot="headerSlot"
			v-if="$utt.isRunning"
			@click.stop="closeHandle"
			class="mr12"
		>
			<template slot="title">
				<span>关闭记录</span>
			</template>
			<a-icon type="stop" style="font-size:20px;color:red"></a-icon>
		</a-tooltip>
		<a-badge :count="$utt.tasks.length" @click.stop="openModal">
			<a-icon type="ordered-list" style="font-size:20px;"></a-icon>
		</a-badge>
		<a-modal title="测试日志记录" v-model="visible" @ok="okHandle" width="70%">
			开始页面：{{$utt.openUrl}}
			<ztable :tableConfig="uitestTableConfig" :dataSource="$utt.tasks"></ztable>
			<template slot="footer">
				<a-button key="back" @click="cancelHandle">取消</a-button>
				<a-button key="reset" type="primary" @click="resetHandle">重置</a-button>
				<a-button key="submit" type="primary" @click="okHandle">保存</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { uitestTableMixin } from './uitest.table.cong'

export default {
	name: 'zuitest',
	disableUtt: true,
	mixins: [uitestTableMixin],
	props: {
		postTasksAPI: {
			type: String,
			default: '/request_new/'
		}
	},
	data() {
		return {
			visible: false,
			//uitestDataSource: [],
			testTitle: ''
		}
	},
	methods: {
		documentHandle(e) {
			if (!e.target) {
				return
			}
			let targetClass = e.target.getAttribute('class')
			//查找ant-form报错文案
			if (targetClass === 'ant-form-explain') {
				// 判断特定格式
				let parentsId = ''
				let hasErrorClass = e.path.some(path => {
					if (
						path &&
						path.getAttribute &&
						path.getAttribute('class')
					) {
						return (
							path.getAttribute('class') ===
							'ant-form-item-control has-error'
						)
					}
				})
				if (!hasErrorClass) {
					return
				}
				// 查找最近ID
				let lastId = null
				e.path.filter(path => {
					if (!path || lastId) {
						return
					}
					let findId = path.getAttribute('id')
					if (findId) {
						lastId = findId
					}
				})
				if (lastId) {
					let task = {}
					task.by_select = `id+css`
					task.by_val = `#${lastId} .has-error .ant-form-explain`
					task.param = `${e.target.innerText}`
					task.type = 'check'
					task.time = '0'
					task.step = `校验错误文本信息`
					this.$utt.addTask(task)
				}
			}
			this.$emit('targetElement', e)
		},
		playHandle() {
			this.$utt.openUrl = location.href
			this.$utt.setBaseParam('openUrl', location.href)
			this.$utt.startTask()
			this.$emit('startTask')
			document.addEventListener('click', this.documentHandle)
		},
		closeHandle() {
			this.$utt.closeTask()
			document.removeEventListener('click', this.documentHandle)
			this.$emit('closeTask')
		},
		openModal() {
			this.visible = true
		},
		cancelHandle() {
			this.visible = false
		},
		resetHandle() {
			this.$utt.reset()
		},
		okHandle() {
			let { tasks, platform, baseParams } = this.$utt
			let params = {}
			const defaultDatas = {
				step: '', // 事件说明
				by_select: '', // 查询方式
				by_val: '', // 查询值
				type: '', // 操作类型
				param: '', // 当需要给输入框赋值时需要传这个
				time: '' // 事件戳
			}

			let datas = []
			tasks.forEach(item => {
				item = Object.assign(defaultDatas, item)
				datas.push(item)
			})

			params.datas = datas
			params.platform = platform
			axios
				.post(this.postTasksAPI, { ...params, ...baseParams })
				.then(res => {
					this.$message.success('Successful')
					this.visible = false
					this.$emit('submit')
				})
		}
	}
}
</script>
<style lang=less>
.mr12 {
	margin-right: 12px;
}
.currentTask {
	background: #f9e7e7;
}
</style>