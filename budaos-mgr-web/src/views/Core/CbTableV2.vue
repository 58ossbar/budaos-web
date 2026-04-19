<template>
  <div>
    <!--表格栏-->
    <el-table
      v-loading="loading"
      v-if="data.list"
      ref="table"
      :data="data.list"
      :highlight-current-row="highlightCurrentRow"
      :is-open="isOpen"
      :element-loading-text="$t('action.loading')"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :size="size"
      :align="align"
      style="width:100%;"
      @selection-change="selectionChange"
      @row-click="rowClick"
      @select="select"
      @cell-click="cellClick"
      @current-change="handleCurrentChange" >
      <!-- checkbox列 -->
      <el-table-column v-if="checkbox" type="selection" width="45"/>
      <!--数据列-->
      <el-table-column
        v-for="column in columns"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :key="column.prop"
        :type="column.type"
        :formatter="column.formatter"
        :sortable="column.sortable == null ? true : column.sortable"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <!-- 自定义列switch开关 -->
          <el-switch
            v-if="['el-switch', 'switch'].includes(column.dataType)"
            :id="scope.row[column.prop] + column.prop"
            :value="scope.row[column.prop] === column.activeValue"
            :active-color="column.activeColor || '#13ce66'"
            :inactive-color="column.activeColor || '#ff4949'"
            @change="dataTypeClick($event, scope.$index, scope.row, column.callback)"/>
          <!-- 自定义列超链接 -->
          <span
            v-else-if="['el-link', 'link'].includes(column.dataType)"
            class="el-menu-item is-active"
            style="margin-left: -10px"
            @click="dataTypeClick($event, scope.$index, scope.row, column.callback)">
            {{ formatterData(scope, column.prop) }}
          </span>
          <!--自定义列头像-->
          <el-popover v-else-if="['el-image', 'image', 'img'].includes(column.dataType)" placement="right" title="" trigger="hover">
            <img :src="formatterData(scope, column.prop)" style="max-width: 300px; max-height: 300px" >
            <img
              v-if="!column.type"
              slot="reference"
              :src="formatterData(scope, column.prop)"
              style="width: 40px;height: 40px;display: block;border-radius: 50%"
              @click="dataTypeClick($event, scope.$index, scope.row, column.callback)" >
            <img
              v-else-if="column.type == 2"
              slot="reference"
              :name="column.prop"
              :title="scope.row[column.title]"
              :src="formatterData(scope, column.prop)"
              @click="dataTypeClick($event, scope.$index, scope.row, column.callback)" >
          </el-popover>
          <!--自定义列tag标签-->
          <!--默认普通列-->
          <span v-else>
            {{ formatterData(scope, column.prop) }}
          </span>
        </template>
      </el-table-column>
      <!--操作列-->
      <el-table-column v-if="btnColumns && btnColumns.length > 0" :label="$t('action.operation')" width="155" fixed="right" header-align="center" align="center">
        <template slot-scope="scope" >
          <div v-if="btnColumns.length < 3">
            <cb-button
              v-for="btnColumn in btnColumns"
              :key="btnColumn.label"
              :icon="btnColumn.icon"
              :label="btnColumn.label"
              :perms="btnColumn.perms"
              type="primary"
              class="editButtonPost"
              @click="handleClick(scope.row, scope.$index, btnColumn.callback)"
            />
          </div>
          <div v-else>
            <cb-button
              :icon="btnColumns[0].icon"
              :label="btnColumns[0].label"
              :perms="btnColumns[0].perms"
              type="primary"
              class="editButtonPost"
              @click="handleClick(scope.row, scope.$index, btnColumns[0].callback)"
            />
            <el-dropdown v-if="hasPerms(btnColumns.map(item => item.perms))" ref="cbDropdown" :show-timeout="0" class="tabs-tools" trigger="click">
              <el-button ref="moreButton" size="mini" icon="fa fa-angle-down" type="primary" class="editButtonPost" >{{ $t('action.more') }}</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(btnColumn,index) in btnColumns" :key="btnColumn.label" class="widthAll paddingNone" style="height: auto;line-height: 20px;" >
                  <!-- 上移下移按钮 -->
                  <cb-button
                    v-if="index > 0 && scope.$index !== 0 && btnColumn.moveType && ['up', 'moveUp'].includes(btnColumn.moveType)"
                    :icon="btnColumn.icon"
                    :label="btnColumn.label"
                    :perms="btnColumn.perms"
                    :title="btnColumn.title"
                    class="treeHoverUlButtom"
                    @click="handleClick(scope.row, scope.$index, btnColumn.callback)"/>
                  <cb-button
                    v-if="index > 0 && scope.$index+1!==data.list.length && btnColumn.moveType && ['down', 'moveDown'].includes(btnColumn.moveType)"
                    :icon="btnColumn.icon"
                    :label="btnColumn.label"
                    :perms="btnColumn.perms"
                    :title="btnColumn.title"
                    class="treeHoverUlButtom"
                    @click="handleClick(scope.row, scope.$index, btnColumn.callback)"/>
                  <!-- 其它按钮 -->
                  <cb-button
                    v-if="index > 0 && !btnColumn.moveType"
                    :icon="btnColumn.icon"
                    :label="btnColumn.label"
                    :perms="btnColumn.perms"
                    :title="btnColumn.title"
                    class="treeHoverUlButtom"
                    @click="handleClick(scope.row, scope.$index, btnColumn.callback)"/>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
      <cb-button
        v-if="selections.length > 0"
        :label="$t('action.batchDelete')"
        :perms="permsBatchDelete"
        :size="size"
        :disabled="selections.length === 0"
        type="primary"
        style="float:left;"
        @click="handleBatchDelete()">
        <template v-if="otherBatchBtnColumns && otherBatchBtnColumns.length > 0 && selections.length > 0">
          <cb-button
            v-for="btnColumn in otherBatchBtnColumns"
            :key="btnColumn.label"
            :label="btnColumn.label"
            :perms="btnColumn.perms"
            size="small"
            type="primary"
            style="float:left;"
            @click="handleOtherBatchClick(btnColumns.callback)"/>
        </template>
      </cb-button>
      <el-pagination
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :page-sizes="pageRequest.pageSizes"
        :pager-count="pageRequest.pagerCount"
        :total="data.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;"
        @current-change="refreshPageRequest"
        @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'
import {hasPermissionList} from '@/permission/index.js'

export default {
  name: 'CbTable',
  components: {
    CbButton
  },
  props: {
    parentVue: {
      type: Object,
      required: true
    },
    rowKey: {
      type: String,
      required: true
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => { return [] }
    },
    // 操作列中的按钮定义，数据格式为json数组，示例如下，如果不需要操作列，则不传
    btnColumns: {
      type: Array,
      default: () => { return [] }
    },
    // 选中列后 出现在 批量删除 一起的 的按钮定义，数据格式为json数组，示例如下，如果不需要其他批量操作，则不传
    otherBatchBtnColumns: {
      type: Array,
      default: () => { return [] }
    },
    // 表格分页数据
    data: {
      type: Object,
      default: () => { return {} }
    },
    // 表格是否显示多选框
    checkbox: {
      type: Boolean,
      default: true
    },
    // 批量删除按钮的权限标识，如果不需要该按钮，则不传，可选参数
    permsBatchDelete: {
      type: String,
      required: false,
      default: ''
    },
    // 尺寸样式
    size: {
      type: String,
      default: 'mini',
      required: false
    },
    // 文本对齐方式
    align: {
      type: String,
      default: 'left'
    },
    // 表格最大高度
    maxHeight: {
      type: Number,
      default: 420
    },
    // 是否显示表格边框，布尔值类型时，组件使用那边直接用 border 就行，无需定义布尔类型的变量 :border="flag" flag: true
    border: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否显示斑马线
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    // 是否单行显示
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    // switch 打开时的值
    activeValue: { type: String, default: '1' },
    // switch 关闭时的值
    inactiveValue: { type: String, default: '0' },
    // switch 打开时的文字描述
    activeText: { type: String, default: '' },
    // switch 关闭时的文字描述
    inactiveText: { type: String, default: '' }
  },
  data() {
    return {
      // 所有权限标识
      perms: {},
      permsLength: 0,
      // 分页信息
      pageRequest: {
        // 当前页码  page
        pageNum: 1,
        // 一页显示几条 limit
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        // 显示几个页数按钮
        pagerCount: 5
      },
      // 加载标识
      loading: false,
      // 列表选中列
      selections: []
    }
  },
  mounted() {
    this.refreshPageRequest(1)
  },
  methods: {
    // 自定义列增加formatter格式化函数
    formatterData: function(scope, prop) {
      return scope.column.formatter ? scope.column.formatter(scope.row, scope.column, scope.row[prop]) : scope.row[prop]
    },
    // 操作栏按钮回调事件
    handleClick: function(row, index, callback) {
      // 处理-表格行的选中效果
      // 先清除选中效果
      this.$refs.table.clearSelection()
      // 再重新选中当前选中的行
      this.$refs.table.toggleRowSelection(row)
      if (callback) {
        this.parentVue[callback](row, index)
      }
    },
    // 分页查询
    findPage: function() {
      this.loading = true
      const callback = res => {
        this.loading = false
      }
      this.$emit('findPage', { pageRequest: this.pageRequest, callback: callback })
    },
    hasPerms: function(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermissionList(perms) & !this.disabled
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections
      this.$emit('selectionChange', selections, this.$refs.table)
    },
    handleSizeChange: function(val) {
      this.pageRequest.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageRequest.pageNum = 1
      this.findPage()
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 选择切换
    handleCurrentChange: function(val) {
      this.$emit('handleCurrentChange', val)
    },
    // 删除
    handleDelete: function(row, index) {
      if (row.id) {
        // 先清除所有选中项目
        this.$refs.table.clearSelection()
        // 再重新选中
        this.$refs.table.toggleRowSelection(row)
        this.delete(row.id, row)
      } else {
        this.$emit('handleDeleteOther', row, this.$refs.table)
      }
    },
    // 批量删除
    handleBatchDelete: function() {
      if (this.selections.length < 1) {
        this.$message({ message: '请选择一条记录', type: 'warning' })
      } else {
        // const ids = this.selections.map(item => item[this.rowKey]).toString()
        const ids = this.selections.map(item => { return item[this.rowKey] })
        if (!ids && !ids.length) {
          return false
        }
        this.$emit('handleBatchDelete', ids, this.selections)
      }
    },
    // 点击表格中的行触发该事件
    rowClick: function(row, column, event) {
      if (this.isOpen) {
        // 如果点击的是switch开关之状态一栏，则不让它触发
        if (column.property === 'status') {
          return false
        }
        // 如果点击的是操作一栏
        if (column.label === '操作') {
          if (event.target.innerText === '更多') {
            this.$refs.table.clearSelection()
          }
        }
        // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.$refs.table.toggleRowSelection(row)
        // row,column,obj,list某些地方可能用到
        this.$emit('toggleRowSelection', { row: row, column: column, obj: row, list: this.selections, vue: this.$refs.table })
      }
    },
    cellClick: function(row, column, cell, event) {
      if (this.showUserName && (column.label === '姓名' || column.label === '真实姓名')) {
        this.$emit('ReadName', { row: row })
      }
    },
    select: function(selection, row) {},
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    /**
       * 查看明细
       * @param index 下标
       * @param row 当前对象
       */
    handleView(index, row) {
      this.$emit('handleView', index, row)
    },

    /**
       * 表格列中更多按钮触发事件
       * @param event
       * @param index
       * @param row
       * @param data
       */
    moreButton(event, index, row, data) {},

    /**
       *  自定义列的点击事件
       * @param {*} event
       * @param {*} index 下标
       * @param {*} row 当前被点击的行数据
       * @param {*} callbackName 自定义的回调函数名称
       */
    dataTypeClick(event, index, row, callbackName) {
      if (callbackName) {
        this.parentVue[callbackName](row, index, event)
      }
    }
  }
}
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 5px;
  }
</style>
