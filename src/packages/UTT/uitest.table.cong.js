export const uitestTableMixin = {
    data() {
        return {
            uitestTableConfig: {
                disableUITest: true,
                rowClassName: (record, index) => {
                    if (index == this.$utt.currentTask) {
                        return "currentTask"
                    }
                },
                columns: [
                    {
                        title: '步骤描述',
                        dataIndex: 'step',
                        scopedSlots: { customRender: 'step' },
                        space: 5,
                        templates: [
                            {
                                type: 'text',
                                props: 'step',
                                editOptions: {
                                    saveHandle: ({
                                        newValue,
                                        record
                                    }) => {
                                        this.uitestDataSource = this.uitestDataSource.map(item => {
                                            if (item.target === record.target) {
                                                item.step = newValue
                                            }
                                            return item
                                        })
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: '请求方式',
                        dataIndex: 'type',
                        scopedSlots: { customRender: 'type' }
                    },
                    // {
                    //     title: '目标',
                    //     dataIndex: 'target',
                    //     scopedSlots: { customRender: 'target' }
                    // },
                    {
                        title: '定位方式',
                        dataIndex: 'by_select',
                        scopedSlots: { customRender: 'by_select' }
                    },
                    {
                        title: '定位值',
                        dataIndex: 'by_val',
                        scopedSlots: { customRender: 'by_val' }
                    },
                    {
                        title: '值',
                        dataIndex: 'param',
                        scopedSlots: { customRender: 'value' }
                    },
                    {
                        title: '等待时间',
                        dataIndex: 'time',
                        scopedSlots: { customRender: 'time' }
                    },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        scopedSlots: { customRender: 'action' },
                        // fixed:"right",
                        space: 5,
                        templates: [{
                            style: "btn-link",
                            text: "删除",
                            clickHandle: ({ record, index }) => {
                                this.$utt.deleteTask(index)
                            }
                        }, {
                            style: "btn-link",
                            text: "追加",
                            clickHandle: ({ record, index }) => {
                                this.$utt.appendTask(index)
                            }
                        }]
                    }
                ]
            }
        }
    }
}
