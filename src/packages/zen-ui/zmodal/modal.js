import {
    Modal
}
    from 'ant-design-vue';
export function openModal(options, self) {
    if (self && self.$utt && self.$utt.isRunning) {
        //添加uitest日志
        let task = {}
        task.by_select = 'class'
        task.by_val = options.wrapClassName || 'ant-modal'
        task.param = options.title
        task.type = 'check'
        task.time = '0'
        task.step = '校验标题'
        self.$utt.addTask(task)
    }
}
export default {
    name: 'zmodalJs',
    info: (options, self) => {
        openModal(options, self)
        let newOptions = Object.assign({}, options);
        delete newOptions.onCancel
        delete newOptions.onOk
        return Modal.info(Object.assign(newOptions, {
            onCancel: () => {
                options.onCancel && options.onCancel(options);
            },
            onOk: () => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-ok'
                    task.param = options.okText || 'OK'
                    task.type = 'click'
                    task.time = '0'
                    task.step = '点击确定按钮'
                    self.$utt.addTask(task)
                }
                options.onOk && options.onOk(options);
            }
        }));
    },
    success: (options, self) => {
        openModal(options, self)
        let newOptions = Object.assign({}, options);
        delete newOptions.onCancel
        delete newOptions.onOk
        return Modal.success(Object.assign(newOptions, {
            onCancel: () => {
                options.onCancel && options.onCancel(options);
            },
            onOk: () => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-ok'
                    task.param = options.okText || 'OK'
                    task.type = 'click'
                    task.time = '0'
                    task.step = '点击确定按钮'
                    self.$utt.addTask(task)
                }
                options.onOk && options.onOk(options);
            }
        }));
    },
    error: (options, self) => {
        openModal(options, self)
        let newOptions = Object.assign({}, options);
        delete newOptions.onCancel
        delete newOptions.onOk
        return Modal.error(Object.assign(newOptions, {
            onCancel: () => {
                options.onCancel && options.onCancel(options);
            },
            onOk: () => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-ok'
                    task.param = options.okText || 'OK'
                    task.type = 'click'
                    task.time = '0'
                    task.step = '点击确定按钮'
                    self.$utt.addTask(task)
                }
                options.onOk && options.onOk(options);
            }
        }));
    },
    warning: (options, self) => {
        openModal(options, self)
        let newOptions = Object.assign({}, options);
        delete newOptions.onCancel
        delete newOptions.onOk
        return Modal.warning(Object.assign(newOptions, {
            onCancel: () => {
                options.onCancel && options.onCancel(options);
            },
            onOk: () => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-ok'
                    task.param = options.okText || 'OK'
                    task.type = 'click'
                    task.time = '0'
                    task.step = '点击确定按钮'
                    self.$utt.addTask(task)
                }
                options.onOk && options.onOk(options);
            }
        }));
    },
    confirm: (options, self) => {
        openModal(options, self)
        let newOptions = Object.assign({}, options);
        delete newOptions.onCancel
        delete newOptions.onOk
        return Modal.confirm(Object.assign(newOptions, {
            onCancel: (e) => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-cancel'
                    task.param = options.cancelText || 'Cancel'
                    task.type = 'click'
                    task.time = '0'
                    if (e instanceof Function) {
                        task.step = '点击cancel按钮'
                        self.$utt.addTask(task)
                    }
                }
                options.onCancel && options.onCancel(options);
            },
            onOk: () => {
                if (self && self.$utt && self.$utt.isRunning) {
                    //添加uitest日志
                    let task = {}
                    task.by_select = 'class'
                    task.by_val = 'ant-modal-ok'
                    task.param = options.okText || 'OK'
                    task.type = 'click'
                    task.time = '0'
                    task.step = '点击确定按钮'
                    self.$utt.addTask(task)
                }
                options.onOk && options.onOk(options);
            }
        }));
    }
}
