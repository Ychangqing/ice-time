<template>
    <div>
        <!--<div v-if="!fixedLabelWidth">
            <a-row>
                <a-col :span="8" :style="{textAlign:textAlign}" class="custom-label-loyat__left">
                    {{labelName}}：
                </a-col>
                <a-col :span="16">
                    <a-input-group compact v-if="hasCompact">
                        <slot></slot>
                    </a-input-group>
                    <div v-else>
                        <slot></slot>
                    </div>
                </a-col>
            </a-row>
        </div>-->
        <div :class="['custom-label-loyat',formLayout]">
            <div class="custom-label-loyat__left" :style="{minWidth:fixedLabelWidth,textAlign:textAlign}">
                <span style="color:red" v-if="isRequired">*</span>{{labelName}}:
            </div>
            <div class="custom-label-loyat__right">
                <a-input-group compact v-if="hasCompact">
                    <slot></slot>
                </a-input-group>
                <div v-else>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {}
        },
        props: {
            fixedLabelWidth: {
                type: String
            },
            labelName: {
                type: String
            },
            textAlign: {
                type: String,
                default: "right"
            },
            hasCompact: {
                type:Boolean,
                default:false
            },
            isRequired: {
                type:Boolean,
                default:false
            },
            formLayout: {
                type: String,
                default: "horizontal"
            }
        },
        methods: {},
        computed: {},
    }

</script>

<style lang=less>
</style>
