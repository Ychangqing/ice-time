import uitest from './uitest.vue';
import getCssPath from './cssPath.js';

class UITest {
    constructor(options) {
        this.isRunning = false //是否启动监控
        this.currentTask = 0 //当前操作索引
        this.tasks = [] //测试任务集合
        this.activeType = "" //当前操作元素类型
        this.asyncStartTime = null //用于记录异步接口的开始时间
        this.asyncModel = null //用于记录异步接口模块
        this.openUrl = null
        this.platform = ""
        this.init(options)
    }
    closeTask(options) {
        this.isRunning = false
    }
    startTask() {
        this.isRunning = true
    }
    getCssPath(elm, rootNode, list) {
        getCssPath(elm, rootNode, list)
    }
    addTask(task) {
        if (window === window.top) {
            return
        }
        this.tasks.splice(this.currentTask + 1, 0, task)
        this.currentTask = this.tasks.length - 1
    }
    deleteTask(index) {
        this.tasks.splice(index, 1)
        this.currentTask = this.tasks.length - 1
    }
    appendTask(index) {
        this.currentTask = index
    }
    setBaseParam(key, val) {
        this.baseParams[key] = val
    }
    resetAsyncData() {
        this.asyncModel = null
        this.asyncStartTime = null
    }
    reset() {
        this.tasks = []
        //this.isRunning = false
        this.currentTask = 0
        this.activeType = ""
        this.asyncStartTime = null
        this.asyncModel = null
        this.openUrl = null
    }
    getTime(name) {
        if (
            name &&
            name === this.asyncModel &&
            this.asyncStartTime
        ) {
            let time = (new Date().getTime() - this.asyncStartTime) /
                1000 +
                ''
            this.resetAsyncData()
            return time
        } else {
            return "0"
        }
    }
    setAsyncData(modelName) {
        this.asyncModel = modelName
        this.asyncStartTime = new Date().getTime()
    }
    init(options) {
        this.isDeleteTask = options.isDeleteTask || false //是否为删除任务标志
        this.isAddTask = options.isDeleteTask || false //是否为追加任务标志
        this.currentTaskId = options.currentTaskId || "" //当前任务ID
        this.baseParams = options.baseParams || {} //基础参数集合，如openUrl(打开浏览器地址)
        this.platform = options.platform || ""
    }
}

UITest.install = function (vue) {
    // 每个组建都添加this.$zt方法

    let _utt = null
    vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.utt) {
                this._utt = this.$options.utt
                _utt = this.$options.utt
                //_cmz对象发生改变，触发试图更新
                vue.util.defineReactive(this, "xxx", this._utt)
            } else {
                if (!this.$parent) {
                    this._utt = _utt
                    return
                }
                this._utt = this.$parent._utt
            }
            Object.defineProperty(this, "$utt", {
                get() {
                    return this._utt
                }
            })
        },
        methods: {
            findNameByOptions(vm) {
                let ret = false
                let parent = vm.$parent
                while (parent) {
                    parent = parent.$parent
                    if (parent && parent.$options.disableUtt) {
                        ret = true
                        break;
                    }

                }
                return ret
            },
            isDisabledUTT() {
                if (this.$parent) {
                    let result = this.findNameByOptions(this)
                    return result

                }
            }
        },
    })

    vue.component("uitest", uitest)
}
export default UITest;
