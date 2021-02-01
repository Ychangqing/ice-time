<template>
	<div :class="['zen-form',formSizeClass]">
		<a-form :form="form">
			<a-row :gutter="24">
				<!-- <draggable
					class="dragArea list-group"
					:list="formConfig.columns"
					group="people"
					@change="changeHandle__drag"
					:style="{minHeight:formConfig.openDrag ? '300px' : '10px'}"
				>-->
				<template v-for="(item,columnIndex) in formConfig.columns">
					<a-col
						v-show="item.isHidden != undefined ? !item.isHidden : true"
						:key="columnIndex"
						:span="item.col ? item.col : formConfig.col || 24"
						@click="selectGroup(item)"
						:class="['drag-widget',item.key===currentKey ? 'current' : '']"
					>
						<!-- <a-icon type="drag" class="drag-widget-icon--drag" />
						<a-icon type="delete" class="drag-widget-icon--delete" @click.stop="deleteHandle__drag" />-->
						<!--input-->
						<form-item
							v-if="item.type==='input'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-input
								v-decorator="[
                                    item.props,
                                    {rules:item.rules,validateFirst:true}
                                ]"
								:size="formConfig.size"
								:placeholder="$t(item.placeholder) || ''"
								:disabled="item.isDisabled"
								:addonBefore="item.addonBefore"
								:addonAfter="item.addonAfter"
								@click="(e)=>{clickHandle(e,item)}"
								@change="(e)=>{changeHandle(e,item)}"
								@blur="(e)=>{blurHandle(e,item)}"
							>
								<template v-for="(icon,index3) in item.icons">
									<a-icon
										:key="index3"
										:slot="icon.slot"
										:type="icon.type"
										@click="(e)=>{clickHandle(e,item,icon)}"
									/>
								</template>
							</a-input>
						</form-item>
						<!--input number-->
						<form-item
							v-if="item.type==='input-number'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-input-number
								v-decorator="[
										item.props,
										{rules:item.rules,validateFirst:true}
                                	]"
								:size="formConfig.size"
								:placeholder="$t(item.placeholder) || ''"
								:disabled="item.isDisabled"
								:step="item.step || 1"
								@change="(e)=>{changeHandleByValue(e,item)}"
								@blur="(e)=>{blurHandle(e,item)}"
							></a-input-number>
						</form-item>
						<!--textarea-->
						<form-item
							v-if="item.type==='textarea'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-textarea
								v-decorator="[
										item.props,
										{rules:item.rules,validateFirst:true}
                                	]"
								:disabled="item.isDisabled"
								:placeholder="$t(item.placeholder) || ''"
								:rows="item.rows?item.rows+'':null"
								:id="item.props"
								@click="(e)=>{clickHandle(e,item)}"
								@change="(e)=>{changeHandle(e,item)}"
								@blur="(e)=>{blurHandle(e,item)}"
							/>
						</form-item>
						<!-- checkbox -->
						<form-item
							v-if="item.type==='checkbox'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-checkbox
								v-decorator="[
										item.props,
										{rules:item.rules,validateFirst:true}
                                	]"
								:disabled="item.isDisabled || false"
								:checked="item.checked"
								:size="formConfig.size"
								:indeterminate="item.indeterminate"
								@click="clickTask(null, item, item, `checkbox选择值-${item.label}`,false)"
								@change="(e)=>{changeCheckedHandle(e,item)}"
							>{{$t(item.label) || $t(item.title)}}</a-checkbox>
						</form-item>
						<!-- checkboxGroup -->
						<form-item
							v-if="item.type==='checkboxGroup'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-checkbox-group
								v-if="item.subCol"
								class="zen-form--checkboxgroup"
								v-decorator="[
                                    item.props,
                                    { initialValue: item.list },
                                    {rules:item.rules,validateFirst:true}
                                ]"
								@change="(e)=>{changeCheckedGroupHandle(e,item)}"
								:size="formConfig.size"
							>
								<a-row>
									<template v-for="(checkboxItem, index) in item.options">
										<a-col
											:span="item.subCol"
											:key="index"
											:style="{marginBottom: item.marginBottom + 'px' || '0px'}"
										>
											<a-checkbox
												:disabled="item.disabled && item.disabled.includes(checkboxItem.value)"
												:value="checkboxItem.value"
												@click="clickTask(index, checkboxItem, item, `checkbox选择值-${item.label}`, 'div/div/')"
											>{{$t(checkboxItem.label)}}</a-checkbox>
										</a-col>
									</template>
								</a-row>
							</a-checkbox-group>
							<a-checkbox-group
								v-else
								v-decorator="[
                                    item.props,
                                    { initialValue: item.list },
                                    {rules:item.rules,validateFirst:true}
                                ]"
								@change="(e)=>{changeCheckedGroupHandle(e,item)}"
								:size="formConfig.size"
							>
								<a-checkbox
									v-for="(checkboxItem, index) in item.options"
									:key="index"
									:disabled="item.disabled && item.disabled.includes(checkboxItem.value)"
									:value="checkboxItem.value"
									@click="clickTask(index, checkboxItem, item, `checkbox选择值-${item.label}`)"
								>{{$t(checkboxItem.label)}}</a-checkbox>
							</a-checkbox-group>
						</form-item>
						<!-- radio -->
						<form-item
							v-if="item.type==='radio'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-radio
								v-decorator="[
                                    item.props
                                ]"
								:disabled="item.isDisabled || false"
								:checked="true"
								:size="formConfig.size"
							>{{$t(item.label) || $t(item.title)}}</a-radio>
						</form-item>
						<!-- radioGroup -->
						<form-item
							v-if="item.type==='radioGroup'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-radio-group
								v-if="item.subCol"
								class="zen-form--checkboxgroup"
								v-decorator="[
                                    item.props,
                                    { initialValue: item.defaultValue },
                                    {rules:item.rules, validateFirst:true}
                                ]"
								@change="(e)=>{changeRadioGroupHandle(e,item)}"
								:size="formConfig.size"
							>
								<a-row>
									<template v-for="(checkboxItem, index) in item.options">
										<a-col :span="item.subCol" :key="index">
											<a-radio
												:value="checkboxItem.value"
												@click="clickTask(index, checkboxItem, item, `radio选择值-${item.label}`, 'div/div/')"
											>{{$t(checkboxItem.label)}}</a-radio>
										</a-col>
									</template>
								</a-row>
							</a-radio-group>
							<a-radio-group
								v-else-if="item.style && item.style == 'button'"
								:size="formConfig.size"
								:buttonStyle="item.buttonStyle"
								:disabled="item.isDisabled"
								v-decorator="[
                                    item.props,
                                    { initialValue: item.defaultValue },
                                    {rules:item.rules, validateFirst:true}
                                ]"
								@change="(e)=>{changeRadioGroupHandle(e,item)}"
							>
								<a-radio-button
									:value="checkboxItem.value"
									v-for="(checkboxItem, index) in item.options"
									:key="index"
									@click="clickTask(index, checkboxItem, item, `radio选择值-${item.label}`)"
								>{{$t(checkboxItem.label)}}</a-radio-button>
							</a-radio-group>
							<a-radio-group
								v-else
								:disabled="item.isDisabled"
								v-decorator="[
                                    item.props,
                                    { initialValue: item.defaultValue },
                                    {rules:item.rules, validateFirst:true}
                                ]"
								@change="(e)=>{changeRadioGroupHandle(e,item)}"
								:size="formConfig.size"
							>
								<a-row>
									<a-col :span="24">
										<template v-for="(checkboxItem, index) in item.options">
											<a-radio
												:key="index"
												:value="checkboxItem.value"
												@click="clickTask(index, checkboxItem, item, `radio选择值-${item.label}`, 'div/div/')"
											>{{$t(checkboxItem.label)}}</a-radio>
										</template>
									</a-col>
								</a-row>
							</a-radio-group>
						</form-item>
						<!-- switch -->
						<form-item
							v-if="item.type==='switch'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-switch
								v-if="!item.checkedChildrenType || item.checkedChildrenType == 'string'"
								v-decorator="[
										item.props,
										{rules:item.rules,
                                        validateFirst:true,
                                        initialValue: item.checked}
                                	]"
								:checked="item.checked"
								:disabled="item.isDisabled || false"
								:checkedChildren="item.checkedChildren || null"
								:unCheckedChildren="item.unCheckedChildren || null"
								:size="formConfig.size"
								@click="(e)=>{clickSwitchHandle(e,item)}"
								@change="(e)=>{changeSwitchHandle(e,item)}"
							/>
							<a-switch
								v-if="item.checkedChildrenType && item.checkedChildrenType == 'icon'"
								v-decorator="[
										item.props,
										{rules:item.rules,
                                        validateFirst:true,
                                        initialValue: item.checked}
                                	]"
								:checked="item.checked"
								:disabled="item.isDisabled || false"
								:size="formConfig.size"
								@click="(e)=>{clickSwitchHandle(e,item)}"
								@change="(e)=>{changeSwitchHandle(e,item)}"
							>
								<a-icon :type="item.checkedChildren" slot="checkedChildren" />
								<a-icon :type="item.unCheckedChildren" slot="unCheckedChildren" />
							</a-switch>
						</form-item>
						<!-- datepicker -->
						<form-item
							v-if="item.type==='datepicker'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-date-picker
								v-decorator="[
										item.props,
										{
											rules:item.rules,
											initialValue: item.defaultValue ? moment(item.defaultValue, item.format || 'YYYY-MM-DD') : null,
											validateFirst:true
										}
                                	]"
								v-if="!item.datepickerType || item.datepickerType === 'date-picker'"
								:size="formConfig.size"
								:disabled="item.isDisabled"
								:placeholder="item.placeholder || ''"
								:format="item.format || 'YYYY-MM-DD'"
								:defaultPickerValue="item.defaultPickerValue ? moment(item.defaultPickerValue, item.format || 'YYYY-MM-DD') : null"
								:disabledDate="(currentDate) => item.disabledDate ? item.disabledDate(currentDate, item) : ''"
								:disabledTime="(currentDate) => item.disabledTime ? item.disabledTime(currentDate, item) : ''"
								:showTime="item.showTimeDefaultValue ? {defaultValue: moment(item.showTimeDefaultValue.time, item.showTimeDefaultValue.format)} : false"
								:allowClear="item.allowClear"
								:showToday="item.showToday"
								@change="(date, dateString) => pickerChangeHandle(date, dateString,item)"
							>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
								<template
									v-if="item.renderExtraFooter"
									slot="renderExtraFooter"
									v-html="item.renderExtraFooter"
								></template>
							</a-date-picker>
							<a-month-picker
								v-if="item.datepickerType === 'month-picker'"
								v-decorator="[
										item.props,
										{
											rules:item.rules,
											initialValue: item.defaultValue ? moment(item.defaultValue, item.format || 'YYYY-MM') : null,
											validateFirst:true,
										}
                                	]"
								:size="formConfig.size"
								:disabled="item.isDisabled"
								:placeholder="item.placeholder || ''"
								:format="item.format || 'YYYY-MM'"
								:defaultPickerValue="item.defaultPickerValue ? moment(item.defaultPickerValue, item.format || 'YYYY-MM') : null"
								:disabledDate="(currentDate) => item.disabledDate ? item.disabledDate(currentDate, item) : ''"
								:allowClear="item.allowClear"
								@change="(date, dateString) => pickerChangeHandle(date, dateString,item)"
							>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
								<template
									v-if="item.renderExtraFooter"
									slot="renderExtraFooter"
									v-html="item.renderExtraFooter"
								></template>
							</a-month-picker>
							<a-range-picker
								v-if="item.datepickerType === 'range-picker'"
								v-decorator="[
										item.props,
										{
											rules:item.rules,
											initialValue: item.defaultValue ? [moment(item.defaultValue[0], item.format || 'YYYY-MM-DD'), moment(item.defaultValue[1], item.format || 'YYYY-MM-DD')] : null,
											validateFirst:true
										}
                                	]"
								:disabled="item.isDisabled"
								:size="formConfig.size"
								:placeholder="item.placeholder || [$locale.startTime, $locale.endTime]"
								:ranges="item.ranges ? item.ranges : ''"
								:format="item.format || 'YYYY-MM-DD'"
								:defaultPickerValue="item.defaultPickerValue ? [moment(item.defaultPickerValue[0], item.format || 'YYYY-MM-DD'), moment(item.defaultPickerValue[1], item.format || 'YYYY-MM-DD')] : null"
								:disabledDate="(currentDate) => item.disabledDate ? item.disabledDate(currentDate, item) : ''"
								:disabledTime="(dates, partial) => item.disabledTime ? item.disabledTime(dates, partial, item) : ''"
								:showTime="item.showTimeDefaultValue ? {defaultValue: [moment(item.showTimeDefaultValue.time, item.showTimeDefaultValue.format), moment(item.showTimeDefaultValue.time, item.showTimeDefaultValue.format)]} : false"
								:allowClear="item.allowClear"
								@change="(date, dateString) => pickerChangeHandle(date, dateString,item)"
							>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
								<template
									v-if="item.renderExtraFooter"
									slot="renderExtraFooter"
									v-html="item.renderExtraFooter"
								></template>
							</a-range-picker>
							<a-week-picker
								v-if="item.datepickerType === 'week-picker'"
								v-decorator="[
										item.props,
										{
											rules:item.rules,
											initialValue: item.defaultValue ? moment(item.defaultValue, item.format || 'YYYY-wo') : null,
											validateFirst:true
										}
                                	]"
								:size="formConfig.size"
								:disabled="item.isDisabled"
								:placeholder="item.placeholder || ''"
								:format="item.format || 'YYYY-wo'"
								:defaultPickerValue="item.defaultPickerValue ? moment(item.defaultPickerValue, item.format || 'YYYY-wo') : null"
								:disabledDate="(currentDate) => item.disabledDate ? item.disabledDate(currentDate, item) : ''"
								:allowClear="item.allowClear"
								@change="(date, dateString) => pickerChangeHandle(date, dateString,item)"
							>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
								<template
									v-if="item.renderExtraFooter"
									slot="renderExtraFooter"
									v-html="item.renderExtraFooter"
								></template>
							</a-week-picker>
						</form-item>
						<!-- timepicker -->
						<form-item
							v-if="item.type==='timepicker'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-time-picker
								v-decorator="[
										item.props,
										{
											rules:item.rules,
											initialValue: moment(item.defaultValue || new Date(), item.format || 'HH:mm:ss'),
											validateFirst:true
										}
                                	]"
								:size="formConfig.size"
								:disabled="item.isDisabled"
								:placeholder="item.placeholder"
								:format="item.format || 'HH:mm:ss'"
								:allowEmpty="item.allowEmpty"
								:clearText="item.clearText"
								:defaultOpenValue="moment(item.defaultOpenValue || new Date(), item.format || 'HH:mm:ss')"
								:disabledHours="() => {return item.disabledHours || []}"
								:disabledMinutes="() => {return item.disabledMinutes || []}"
								:disabledSeconds="() => {return item.disabledSeconds || []}"
								:hideDisabledOptions="item.hideDisabledOptions"
								:hourStep="item.hourStep"
								:minuteStep="item.minuteStep"
								:secondStep="item.secondStep"
								@change="(time, timeString) => item.datePickChangeHandle ? item.datePickChangeHandle(time, timeString, item) : ''"
							>
								<a-button
									v-if="item.addon"
									slot="addon"
									size="small"
									type="primary"
									@click="addonClickHandle(getFieldValueTest(item.props), item)"
								>{{item.addon}}</a-button>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
							</a-time-picker>
						</form-item>
						<!--input search-->
						<form-item
							v-if="item.type==='input-search'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-input-search
								v-decorator="[
										item.props,
										{rules:item.rules,validateFirst:true}
									]"
								:size="formConfig.size"
								:placeholder="item.placeholder || ''"
								:disabled="item.isDisabled"
								:addonBefore="item.addonBefore"
								:addonAfter="item.addonAfter"
								:enterButton="item.searchBtnText"
								@search="(value)=>{searchHandle(value,item)}"
								@change="(e)=>{changeHandle(e,item)}"
								@blur="(e)=>{blurHandle(e,item)}"
							></a-input-search>
						</form-item>
						<!--cascader-->
						<form-item
							v-if="item.type==='cascader'"
							:item="item"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-cascader
								v-decorator="[
                                    item.props,
                                    { initialValue: item.defaultValue }
                                ]"
								:placeholder="item.placeholder"
								:options="item.options"
								:fieldNames="item.fieldNames && { label: item.fieldNames.label, value: item.fieldNames.value, children: item.fieldNames.children }"
								:changeOnSelect="item.changeOnSelect"
								:expandTrigger="item.expandTrigger"
								:showSearch="item.showSearch && {cascaderFilter}"
								:notFoundContent="item.notFoundContent"
								:size="formConfig.size"
								@change="(value)=>{changeHandleByValue(value,item)}"
							>
								<a-icon :type="item.suffixIcon" slot="suffixIcon" class="test" v-if="item.suffixIcon" />
							</a-cascader>
						</form-item>
						<!--select-->
						<form-item
							v-if="item.type==='select'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-select
								v-if="item.searchFilter"
								v-decorator="[
                                    item.props,
                                ]"
								showSearch
								:mode="item.mode"
								:labelInValue="item.labelInValue"
								:placeholder="$t(item.placeholder)"
								:filterOption="selectFilterOption"
								:size="formConfig.size"
								@blur="() => {selectedBlur(item)}"
								@focus="() => {selectedFocus(item)}"
								@change="(value) => (selectHandleChange(value, item))"
							>
								<!--配置options-->
								<template
									v-for="(option,optionIndex) in item.fieldNames ? getfieldNames(item.fieldNames, item.options) : item.options"
								>
									<a-select-option
										v-if="item.options"
										:disabled="option.disabled"
										:key="option.value"
										:id="item.props+'-option'+optionIndex"
										:class="setType2UUID(option.value, item.type, columnIndex)"
									>{{$t(option.text)}}</a-select-option>
								</template>
							</a-select>
							<a-select
								v-else-if="item.searchFetch"
								v-decorator="[
                                    item.props,
                                ]"
								showSearch
								:mode="item.mode"
								:labelInValue="item.labelInValue"
								:placeholder="$t(item.placeholder)"
								:defaultActiveFirstOption="false"
								:showArrow="item.showArrow"
								:filterOption="false"
								:size="formConfig.size"
								@search="(value) => (selectHandleSearch(value, item))"
								@deselect="(value) => {selectedHandle(value, item, columnIndex)}"
								@select="(value) => {selectedHandle(value, item, columnIndex)}"
								@change="(value) => (selectHandleChange(value, item))"
								:notFoundContent="item.searchLoading ? undefined : null"
							>
								<a-spin v-if="item.searchLoading && item.fetching" slot="notFoundContent" size="small" />
								<!--配置options-->
								<template v-for="(option,optionIndex) in item.options">
									<a-select-option
										v-if="item.options"
										:disabled="option.disabled"
										:key="option.value"
										:id="item.props+'-option'+optionIndex"
										:class="setType2UUID(option.value, item.type, columnIndex)"
									>{{$t(option.text)}}</a-select-option>
								</template>
							</a-select>
							<a-select
								v-else
								v-decorator="[
                                    item.props,
                                    { initialValue: item.defaultValue }
                                ]"
								:placeholder="$t(item.placeholder)"
								:disabled="item.isDisabled || false"
								:mode="item.mode"
								:labelInValue="item.labelInValue"
								:maxTagCount="item.maxTagCount"
								:loading="item.loading"
								:tokenSeparators="item.tokenSeparators"
								:showSearch="item.showSearch"
								:allowClear="item.allowClear"
								:showArrow="item.showArrow"
								:notFoundContent="item.notFoundContent"
								@deselect="(value) => {selectedHandle(value, item, columnIndex)}"
								@select="(value) => {selectedHandle(value, item, columnIndex)}"
								@change="(value)=>{changeHandleByValue(value,item)}"
								:size="formConfig.size"
							>
								<a-icon v-if="item.suffixIcon" slot="suffixIcon" :type="item.suffixIcon" />
								<!--配置options-->
								<template
									v-for="(option,optionIndex) in item.fieldNames ? getfieldNames(item.fieldNames, item.options) : item.options"
								>
									<a-select-option
										v-if="item.options"
										:disabled="option.disabled"
										:key="option.value"
										:id="item.props+'-option'+optionIndex"
										:class="setType2UUID(option.value, item.type, columnIndex)"
									>{{$t(option.text)}}</a-select-option>
								</template>
							</a-select>
						</form-item>
						<!--slot-->
						<form-item
							v-if="item.type==='slot'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
						>
							<slot :name="item.slotName" :data="form"></slot>
						</form-item>
						<!--todo list  (oss PR)-->
						<form-item
							v-if="item.type==='todo-list'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<div v-for="k in getFieldValueTest(item.props)" :key="k">
								<template v-for="(subItem, index) in item.subProps">
									<a-input
										:key="index"
										v-if="subItem.type === 'input'"
										v-decorator="[
												`${subItem.props}[${k}]`,
												{rules:subItem.rules,validateFirst:true}
											]"
										placeholder="passenger name"
										style="width: 40%; margin-right: 8px"
										@blur="(e)=>{blurHandle(e,subItem)}"
									/>
								</template>
								<a-icon
									v-if="getFieldValueTest(item.props).length > 1"
									class="dynamic-delete-button"
									type="minus-circle-o"
									:disabled="getFieldValueTest(item.props).length === 1"
									@click="() => remove(k, item.props)"
								/>
							</div>
							<div>
								<a-button type="dashed" style="width: 60%" @click="add(item.props)">
									<a-icon type="plus" />Add field
								</a-button>
							</div>
						</form-item>

						<!--custom group-->
						<div v-if="item.type==='group'">
							<custom-label
								:labelName="item.label"
								:fixedLabelWidth="formConfig.fixedLabelWidth"
								:isRequired="item.isRequired"
								:textAlign="formConfig.textAlign"
								:formLayout="formConfig.formLayout"
							>
								<a-row :gutter="24">
									<template v-for="(subItem,subIndex) in item.groupColumns">
										<a-col :key="subIndex" :span="subItem.col || 24" :id="'zform-'+subItem.props">
											<a-form-item
												:validate-status="subItem.validate && subItem.validate.validateStatus"
												:help="subItem.validate && subItem.validate.errorMsg"
												v-show="!item.isHidden"
											>
												<a-input
													v-decorator="[
                                                    subItem.props,
                                                    {rules:subItem.rules}
                                                ]"
													:placeholder="$t(subItem.placeholder) || ''"
													:disabled="subItem.isDisabled"
													@click="(e)=>{clickHandle(e,subItem)}"
													@change="(e)=>{changeHandle(e,subItem)}"
													:size="formConfig.size"
													@blur="(e)=>{blurHandle(e,subItem)}"
												>
													<template v-for="(icon,index3) in subItem.icons">
														<a-icon
															:key="index3"
															:slot="icon.slot"
															:type="icon.type"
															@click="(e)=>{clickHandle(e,subItem,icon)}"
														/>
													</template>
												</a-input>
											</a-form-item>
										</a-col>
									</template>
								</a-row>
							</custom-label>
						</div>

						<!--upload-->
						<form-item
							v-if="item.type==='upload'"
							:item="item"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-upload
								v-decorator="[item.props, {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: uploadNormFile,
                                    }]"
								:listType="item.listType || 'picture-card'"
								:name="item.name || 'files'"
								:action="item.action"
								list-type="picture"
								@preview="(file)=>{uploadPreviewHandle(file,item)}"
								:remove="(file)=>{return uploadRemoveHandle(file,item)}"
								:disabled="item.isDisabled"
								:showUploadList="item.showUploadList"
								:beforeUpload="(file)=>{return beforeUpload(file,item)}"
								:customRequest="(obj)=>{uploadCustomRequest(obj,item)}"
								:accept="item.accept || null"
							>
								<a-button v-if="item.listType === 'picture' || item.listType === 'text'">
									<a-icon type="upload" />upload
								</a-button>
								<div v-else>
									<a-icon :type="loading ? 'loading' : 'plus'" />
									<div class="ant-upload-text">Upload</div>
								</div>
							</a-upload>
						</form-item>

						<!--oss-upload-->
						<form-item
							v-if="item.type==='oss-upload'"
							:item="item"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-upload
								v-decorator="[item.props, {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: uploadNormFile,
                                    }]"
								:listType="item.listType || 'picture-card'"
								:name="item.name || 'files'"
								list-type="picture"
								@preview="(file)=>{ossUploadPreviewHandle(file,item)}"
								:remove="(file)=>{return uploadRemoveHandle(file,item)}"
								:disabled="item.isDisabled"
								:showUploadList="item.showUploadList"
								:customRequest="(obj)=>{ossUploadCustomRequest(obj,item)}"
							>
								<a-button v-if="item.listType === 'picture' || item.listType === 'text'">
									<a-icon type="upload" />upload
								</a-button>
								<div v-else>
									<a-icon :type="loading ? 'loading' : 'plus'" />
									<div class="ant-upload-text">Upload</div>
								</div>
							</a-upload>
						</form-item>

						<!--tree-select-->
						<form-item
							v-if="item.type==='tree-select'"
							:item="item"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-tree-select
								v-decorator="[
                                        item.props,
                                        {rules:item.rules,validateFirst:true}
                                    ]"
								:placeholder="item.placeholder || ''"
								:dropdownStyle="{ maxHeight: item.maxHeight || '400px', overflow: 'auto' }"
								treeDefaultExpandAll
								:treeData="item.treeData"
								:labelInValue="item.labelInValue || false"
								@change="(value)=>{changeHandleByValue(value,item)}"
								@click="()=>{treeSelectClickHandle(item)}"
								:allowClear="item.allowClear || false"
								:showSearch="item.showSearch || false"
								:multiple="item.multiple || false"
							></a-tree-select>
						</form-item>
						<!--calc-->
						<form-item
							v-if="item.type==='calc'"
							:item="item"
							:size="formConfig.size"
							:fixedLabelWidth="fixedLabelNum"
							:textAlign="formConfig.textAlign"
							:formLayout="formConfig.formLayout"
							:id="'zform-'+item.props"
						>
							<a-input
								v-decorator="[
                                    item.props,
                                    {rules:item.rules,validateFirst:true}
                                ]"
								:size="formConfig.size"
								:placeholder="$t(item.placeholder) || ''"
								disabled
							></a-input>
						</form-item>
					</a-col>
				</template>
				<!--btns-->
				<a-col :span="formConfig.btnsCol || 24" v-if="!this.formConfig.openDrag">
					<div :style="{textAlign:formConfig.btnsPlacement}">
						<a-form-item
							label
							:wrapper-col="{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: formConfig.btnsOffset || 0 },
                            }"
						>
							<template v-for="(btn,index) in formConfig.btns">
								<a-button
									:key="index"
									:type="btn.styleType || null"
									@click="(e)=>{submitHandle(btn)}"
									:style="[
									{width: (btn.type === 'save' || btn.type === 'reset') ? '80px' : 'auto'},
									(btn.type === 'save' || btn.type === 'reset') ? {marginRight: '8px'} : btnMargin]"
									:disabled="btn.isDisabled"
									:size="formConfig.size"
									:id="btn.type"
								>{{$t(btn.name)}}</a-button>
							</template>
						</a-form-item>
					</div>
				</a-col>
				<!-- </draggable> -->
			</a-row>
		</a-form>
	</div>
</template>

<script>
import formItem from './formItem'
import customLabel from './customLabel'
// import draggable from 'vuedraggable'
import moment from 'moment'
import propsDict from '../../props-dict'
import axios from 'axios'
import UpladFile from './utils/uploadToAliOss.js'

function generateUUID() {
	if (process.env.NODE_ENV === 'test') {
		return 'test-uuid'
	}
	let d = new Date().getTime()
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
	})
	return uuid
}

moment.locale('zh-cn')
let idMap = {}
export default {
	name: 'zform',
	components: {
		formItem,
		customLabel
		//draggable
	},
	props: {
		formConfig: {
			type: Object
		},
		formData: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			formLayout: 'horizontal',
			currentKey: '',
			loading: '',
			type2UUID: {}
		}
	},
	beforeCreate() {
		this.form = this.$form.createForm(this)
	},
	created() {
		this.type2UUID = {}
		for (let item of this.formConfig.columns) {
			if (item.defaultValue !== undefined) {
				this.formData[item.props] = item.defaultValue
			}
			if (this.formData[item.props] === undefined) {
				continue
			}
			item.defaultValue = this.formData[item.props]
			if (item.type === 'todo-list') {
				this.form.getFieldDecorator(item.props, {
					initialValue: [],
					preserve: true
				})
				if (this.formData[item.props] === undefined) {
					return
				}
				let fieldsValue = {}
				fieldsValue[item.props] = [
					...new Array(this.formData[item.props].length).keys()
				]
				this.$nextTick(() => {
					this.form.setFieldsValue(fieldsValue)
					idMap[item.props] = this.formData[item.props].length
				})
			}
		}
	},
	mounted() {
		for (let item of this.formConfig.columns) {
			if (item.type !== 'todo-list') {
				continue
			}
			if (this.formData[item.props] === undefined) {
				continue
			}
			const itemFormData = this.formData[item.props]
			item.subProps.forEach(subItem => {
				let na = itemFormData.map(v => {
					return v[subItem.props]
				})
				let fieldsValue = {}
				fieldsValue[subItem.props] = na
				this.$nextTick(() => {
					this.form.setFieldsValue(fieldsValue)
				})
			})
		}
		this.filterFormData(['todo-list', 'datepicker', 'timepicker'])
		setTimeout(() => {
			this.mapColumnsTypeOfFiled()
			this.$nextTick(() => {
				this.form.setFieldsValue(this.formData)
			})
		}, 0)
	},
	computed: {
		fixedLabelNum() {
			/*return (this.formConfig.fixedLabelWidth && typeof this.formConfig.fixedLabelWidth === 'string') ? this
                    .formConfig.fixedLabelWidth : null*/
			return this.formConfig.fixedLabelWidth || '120px'
		},
		// 根据‘left’、‘center’、‘right’不同的显示位置，来计算按钮之间的间距
		btnMargin() {
			let style = {}
			let { btnsPlacement } = this.formConfig
			switch (btnsPlacement) {
				case 'center':
					style.margin = '0 10px'
					break
				case 'left':
					style.marginRight = '20px'
					break
				case 'right':
					style.marginLeft = '20px'
					break

				default:
					style.margin = '0 10px'
					break
			}
			return style
		},
		formSizeClass() {
			let { size } = this.formConfig
			if (size) {
				return 'zen-form--' + size
			}
		}
	},
	watch: {
		'$store.state.lang': function(val) {
			propsDict.changeLang(val)
			// this.$nextTick(() => {
			// 	location.reload()
			// })
		},
		formData: {
			handler(newValue, oldValue) {
				this.type2UUID = {}
				this.$nextTick(() => {
					this.form.setFieldsValue(this.formData)
					this.$nextTick(() => {
						this.form.setFieldsValue(this.formData)
					})
				})
			},
			deep: true
		}
	},
	methods: {
		moment,
		getfieldNames(fieldNames, options) {
			return options.map(item => {
				return {
					value: item[fieldNames.value],
					text: item[fieldNames.text]
				}
			})
		},
		filterFormData(filterTypes) {
			Object.keys(this.formData).forEach(key => {
				let formItem = this.formConfig.columns.find(item => {
					return item.props === key
				})
				if (!formItem) {
					return
				}
				if (filterTypes.indexOf(formItem.type) >= 0) {
					delete this.formData[key]
				}
			})
		},
		getFieldValueTest(props) {
			return this.form.getFieldValue(props)
		},
		remove(k, props) {
			const { form } = this
			const keys = this.getFieldValueTest(props)
			if (keys.length === 1) {
				return
			}
			let fieldsValue = {}
			fieldsValue[props] = keys.filter(key => key !== k)
			this.$nextTick(() => {
				form.setFieldsValue(fieldsValue)
			})
		},
		add(props) {
			const { form } = this
			const keys = this.getFieldValueTest(props)
			idMap[props] = idMap[props] ? idMap[props] : 0
			const nextKeys = keys.concat(++idMap[props])
			let fieldsValue = {}
			fieldsValue[props] = nextKeys
			this.$nextTick(() => {
				form.setFieldsValue(fieldsValue)
			})
		},
		subColumnCallback(value, column, subColumn, fn) {
			let { form } = this
			subColumn[fn]({
				value,
				form,
				column,
				subColumn
			})
		},
		columnCallback(value, column, fn) {
			let { form } = this
			column[fn]({
				value,
				form,
				column
			})
		},
		selectFilterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			)
		},
		cascaderFilter(inputValue, path) {
			return path.some(
				option =>
					option.label
						.toLowerCase()
						.indexOf(inputValue.toLowerCase()) > -1
			)
		},
		selectedBlur(item) {
			item.onBlur && item.onBlur(item)
		},
		selectedFocus(item) {
			item.onFocus && item.onFocus(item)
		},
		selectFetch(value, item, callback) {
			item.fetching = true
			axios.get(item.searchApi).then(response => {
				item.fetching = false
				callback(response.data)
			})
		},
		selectHandleSearch(value, item) {
			item.options = []
			this.selectFetch(value, item, data => {
				item.options = item.fieldNames
					? this.getfieldNames(item.fieldNames, data)
					: data
			})
		},
		selectHandleChange(value, item) {
			this.changeHandleByValue(value, item)
		},
		clickHandle(e, column, subColumn) {
			let value = e.target.value
			if (subColumn && subColumn.clickHandle) {
				this.subColumnCallback(value, column, subColumn, 'clickHandle')
				return
			}
			if (column.clickHandle) {
				this.columnCallback(value, column, 'clickHandle')
			}
		},
		searchHandle(value, column) {
			if (column.searchHandle) {
				this.columnCallback(value, column, 'searchHandle')
			}
		},
		addonClickHandle(value, column, subColumn) {
			if (subColumn && subColumn.clickHandle) {
				this.subColumnCallback(value, column, subColumn, 'clickHandle')
				return
			}
			if (column.addonClickHandle) {
				this.columnCallback(value, column, 'addonClickHandle')
			}
		},
		changeSwitchHandle(e, column) {
			let value = (column.checked = e)
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		clickSwitchHandle(e, column) {
			let value = (column.checked = e)
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = `${column.props}`
				task.param = `${value}`
				task.type = 'click'
				task.time = '0'
				task.step = `修改input值-${column.label}`
				this.$utt.addTask(task)
			}
		},
		clickTask(index, item, column, step, path) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				const task = {
					by_select: 'XPath',
					by_val:
						path === false
							? `//*[@id="${column.props}"]`
							: `//*[@id="${column.props}"]/${path ||
									''}label[${index + 1}]`,
					param: item.label || item.title,
					type: 'click',
					time: '0',
					step: step
				}
				this.$utt.addTask(task)
			}
		},
		changeRadioGroupHandle(e, column) {
			let value = (column.defaultValue = e.target.value)
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		changeCheckedGroupHandle(e, column) {
			let value = (column.list = e)
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		changeCheckedHandle(e, column) {
			let value = (column.checked = e.target.checked)
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		changeHandle(e, column, subColumn) {
			let value = e.target.value
			// 判断是否为计算属性
			if (column.calc) {
				let filter1 = column.calc.match(/[a-z]+[0-9]+/g) || []
				let filter2 = column.calc.match(/[a-z]+/g) || []
				let fileds = [...filter1, ...filter2]
				fileds = Array.from(new Set(fileds))
				let filedsValue = this.form.getFieldsValue(fileds)
				let fn = new Function(fileds.join(','), 'return ' + column.calc)
				let paramsValue = fileds.map(item => {
					if (item === column.props) {
						return parseFloat(value)
					} else {
						return filedsValue[item]
							? parseFloat(filedsValue[item])
							: 0
					}
				})
				let total = fn.apply(null, paramsValue)
				this.$nextTick(() => {
					this.form.setFieldsValue({ [column.bindProps]: total })
				})
			}
			if (subColumn && subColumn.changeHandle) {
				this.subColumnCallback(value, column, subColumn, 'changeHandle')
				return
			}
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		blurHandle(e, column) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = `${column.props}`
				task.param = `${e.target.value}`
				task.type = 'sendKey'
				task.time = '0'
				task.step = `修改input值-${column.label}`
				this.$utt.addTask(task)
			}
		},
		setType2UUID(value, type, columnIndex) {
			if (this.type2UUID[type + value + columnIndex]) {
				return this.type2UUID[type + value + columnIndex]
			}
			const UUID = generateUUID() + value
			this.type2UUID[type + value + columnIndex] = UUID
			return UUID
		},
		selectedHandle(value, item, columnIndex) {
			value = item.labelInValue ? value.label : value
			const className = this.type2UUID[item.type + value + columnIndex]
			const selectDom = document.getElementsByClassName(className)[0]
			var allSelectDom = selectDom.parentNode.getElementsByTagName('li')
			var index = [].indexOf.call(allSelectDom, selectDom)
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				if (this.$utt.activeType !== item.props) {
					this.setSelectTask(
						item.props,
						null,
						`点击select框-${item.label}`
					)
					if (item.mode === 'multiple') {
						this.$utt.activeType = item.props
					}
				}
				//let id = item.props+index
				this.setSelectTask(
					item.props + '-option' + index,
					value,
					`点击select options-${item.label}`
				)
			}

			// index就是点击的索引
		},
		setSelectTask(id, data, step) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id`
				task.by_val = id
				task.param = data || ''
				task.type = 'click'
				task.time = '0'
				task.step = step
				this.$utt.addTask(task)
			}
		},
		changeHandleByValue(val, column, subColumn) {
			let value = val || ''
			if (subColumn && subColumn.changeHandle) {
				this.subColumnCallback(value, column, subColumn, 'changeHandle')
				return
			}
			if (column.changeHandle) {
				this.columnCallback(value, column, 'changeHandle')
			}
		},
		submitHandle(btn) {
			let { form } = this
			// 是否禁用默认行为
			if (!btn.disableDefaultHandle) {
				if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
					//添加uitest日志
					let task = {}
					task.by_select = `id`
					task.by_val = btn.type
					task.param = ''
					task.type = 'click'
					task.time = '0'
					task.step = ''
					this.$utt.addTask(task)
				}
				if (btn.type === 'reset') {
					this.form.resetFields()
				}
				if (btn.type === 'save') {
					let isError = false
					this.form.validateFieldsAndScroll(
						{ firstFields: true },
						(err, values) => {
							if (err) {
								console.log(err)
								isError = true
								// this.form.setFields({username11:{errors:[{
								//     "message": "Please input your username!8888888"
								// }]}})
								return
							}
							for (let item of this.formConfig.columns) {
								if (item.type !== 'todo-list') {
									continue
								}
								let todoListFiled = []
								values[item.props].forEach((value, index) => {
									let subPropsObj = {}
									for (let subItem of item.subProps) {
										subPropsObj[subItem.props] =
											values[subItem.props][value]
									}
									todoListFiled[index] = subPropsObj
								})
								values[item.props] = todoListFiled
							}
						}
					)
					if (isError) {
						return
					}
				}
			}
			if (btn.clickHandle) {
				btn.clickHandle({ form, btn })
			}
		},
		changeHandle__drag(item) {
			if (!this.formConfig.openDrag) {
				return
			}
			if (item.added) {
				let newIndex = item.added.newIndex
				this.currentKey = this.formConfig.columns[newIndex].key
				this.$emit('changeKey', this.currentKey)
			}
			// console.log(this.formConfig)
		},
		deleteHandle__drag() {
			let { columns } = this.formConfig
			let findIndex = 0
			this.formConfig.columns = columns.filter((item, index) => {
				if (item.key === this.currentKey) {
					findIndex = index
				}
				return item.key !== this.currentKey
			})
			if (this.formConfig.columns[findIndex - 1]) {
				this.currentKey = this.formConfig.columns[findIndex - 1].key
				this.$emit('changeKey', this.currentKey)
			}
		},
		selectGroup(column) {
			if (!this.formConfig.openDrag) {
				return
			}
			this.currentKey = column.key === this.currentKey ? '' : column.key
			this.$emit('changeKey', this.currentKey)
		},
		mapColumnsTypeOfFiled() {
			let cloumns = [...this.formConfig.columns]
			cloumns = cloumns.map(item => {
				if (item.filed) {
					const propsConfig = propsDict.getProps(item, 'form')
					item = propsConfig ? Object.assign(propsConfig, item) : item
				}
				return item
			})
			this.formConfig.columns = cloumns
		},
		uploadNormFile(e) {
			if (Array.isArray(e)) {
				return e
			}
			// if (
			// 	e &&
			// 	e.file &&
			// 	e.fileList &&
			// 	(!e.file.status || e.file.status === 'error')
			// ) {
			// 	e.fileList.pop()
			// }
			return e && e.fileList
		},
		uploadPreviewHandle(file, item) {
			if (!item.previewPath && item.listType !== 'text') {
				console.warn('在使用非text类型的控件时，必须添加previewPath')
				return
			}
			this.ossUploadPreviewHandle(file, item)
		},
		ossUploadPreviewHandle(file, item) {
			let url = file.url || item.previewPath + file.filename
			window.open(url)
		},
		uploadRemoveHandle(file, item) {
			let props = item.props
			let values = this.form.getFieldsValue([item.props])
			let newValues = values[item.props].filter(item1 => {
				return file.uid !== item1.uid
			})
			let obj = {}
			obj[item.props] = newValues
			this.$nextTick(() => {
				this.form.setFieldsValue(obj)
			})
			return false
		},
		beforeUpload(file, item) {
			if (item.beforeUpload) {
				if (!item.beforeUpload(file)) {
					console.error('上传')
				}
				return item.beforeUpload(file)
			}
			return true
		},
		onSuccess(props, data) {
			let values = this.form.getFieldsValue([props])
			let len = values[props].length
			values[props][len - 1].status = 'success'
			values[props][len - 1].filename = data.filename
			this.$message.success(this.$locale.fileUploaded)
		},
		onError(props, errorMsg) {
			let msg = errorMsg || this.$locale.uploadFailed
			let values = this.form.getFieldsValue([props])
			let len = values[props].length
			values[props][len - 1].status = 'error'
			this.$message.error(msg)
		},
		uploadCustomRequest(obj, item) {
			let _this = this
			var form = new FormData()
			form.append('file', obj.file) // 文件对象
			var xhr = new XMLHttpRequest()
			xhr.open('post', obj.action, true)
			xhr.onload = function(res) {
				//console.log(res)
			}
			xhr.send(form)
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					let props = item.props
					var res = JSON.parse(xhr.responseText)
					if (res.success) {
						_this.onSuccess(props, res.data)
					} else {
						_this.onError(props, res.msg)
					}
				}
			}
			xhr.ontimeout = function() {
				_this.onError(props)
			}
		},
		ossUploadCustomRequest(obj, item) {
			obj.onProgress()
			UpladFile(obj.file)
				.then(res => {
					res = JSON.parse(res)
					let values = this.form.getFieldsValue([item.props])
					let uploadedFile = values[item.props].find(item => {
						return item.uid === obj.file.uid
					})
					uploadedFile.url = res.url
					obj.onSuccess(res)
					this.$message.success(this.$locale.fileUploaded)
					return res
				})
				.catch(err => {
					obj.onError(err)
					return err
				})
		},
		treeSelectClickHandle(item) {
			let column = item
			if (item.asyncData) {
				item.asyncData({ column })
			}
		},
		setIdTofileds(item) {
			return 'zform-' + item.props
		},
		setTimeTask(xpath, data, step) {
			if (this.$utt && this.$utt.isRunning && !this.isDisabledUTT()) {
				//添加uitest日志
				let task = {}
				task.by_select = `id+css`
				task.by_val = xpath
				task.param = data
				task.type = 'date'
				task.time = '0'
				task.step = step
				this.$utt.addTask(task)
			}
		},
		pickerChangeHandle(date, dateString, item) {
			if (dateString.constructor == Array) {
				dateString.forEach((fore, index) => {
					this.setTimeTask(
						`#${
							item.props
						} .ant-calendar-range-picker-input:nth-child(${
							index === 0 ? 1 : 3
						})`,
						fore,
						`修改时间-${item.props}`
					)
				})
			} else {
				this.setTimeTask(
					`#${item.props} input`,
					dateString,
					`修改时间-${item.props}`
				)
			}
			item.datePickChangeHandle
				? item.datePickChangeHandle(date, dateString, item)
				: ''
		}
	}
}
</script>

<style lang=less>
@import './style/index.less';

.dragArea {
	.drag-widget {
		padding: 3px;
		position: relative;
		border: 1px solid transparent;
		.drag-widget-icon--drag {
			position: absolute;
			top: 5px;
			left: 5px;
			font-size: 20px;
			display: none;
		}
		.drag-widget-icon--delete {
			position: absolute;
			bottom: 0px;
			right: 10px;
			font-size: 20px;
			display: none;
		}
	}
	.drag-widget.current {
		border: 1px dotted @success1-3;
		.drag-widget-icon--drag {
			display: block;
		}
		.drag-widget-icon--delete {
			display: block;
		}
	}
}
</style>
