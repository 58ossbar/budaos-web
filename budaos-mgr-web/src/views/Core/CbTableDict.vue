<template>
  <div>
    <!--表格栏-->
    <el-table  :data="data.list" :highlight-current-row="highlightCurrentRow"
               @selection-change="selectionChange"  min-height="370"
          @current-change="handleCurrentChange" :element-loading-text="$t('action.loading')"
               :border="border" :stripe="stripe"
               v-loading="loading"   @row-click="rowClick" :isOpen="isOpen" ref="table"
          :show-overflow-tooltip="showOverflowTooltip"  :size="size" :align="align" style="width:100%;"  >
      <!---->
      <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable" :show-overflow-tooltip="true" >
      </el-table-column>
      <!--<el-table-column :label="$t('action.operation')" width="185" fixed="right" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <cb-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <cb-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>-->
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <!--<cb-button :label="$t('action.batchDelete')" :perms="permsDelete" :size="size" type="danger" @click="handleBatchDelete()"
        :disabled="this.selections.length===0" style="float:left;" v-if="showBatchDelete & showOperation"/>-->
      <el-pagination  @current-change="refreshPageRequest"
                     @size-change="handleSizeChange"
        :current-page="pageRequest.currPage" :page-size="pageRequest.PageSize"
                     :page-sizes="pageRequest.pageSizes" :pager-count="pageRequest.pagerCount"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="data.totalCount" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"

export default {
  name: 'CbTable',
  components:{
			CbButton
	},
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 修改权限标识
    permsDelete: String,  // 删除权限标识
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    isOpen:{
      type: Boolean,
      default: false
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 420
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 分页信息
			pageRequest: {
        totalCount: 188,//总共多少条数据
        pageSizes:[10, 20, 30, 40],
        PageSize: 10,//一页显示几条  limit
        totalPage: 63,//有多少页
        currPage: 1,//当前页码  page
        pagerCount:5,//显示几个页数按钮
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    // 点击表格中的行触发该事件
    rowClick:function(row, column, event){
      if (this.isOpen){
        var isChecked = false;
        var arr = [];
        if (JSON.stringify(this.selections).indexOf(row.id) == -1){
          this.selections.push(row);
          isChecked = true;
        } else {
          arr.push(row.id);
          isChecked = false;
        }
        this.$refs.table.toggleRowSelection(row); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.$emit('toggleRowSelection', {obj:row, list:this.selections, deleteList:arr, isChecked:isChecked});
      }

    },
    // 分页查询
    findPage: function () {
        this.loading = true;
        let callback = res => {
          this.loading = false
        };
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      this.$emit('selectionChange', {selections:selections})
    },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', {val:val})
    },
    handleSizeChange: function(val) {
      this.pageRequest.PageSize=val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageRequest.currPage=1
      this.findPage()
      /*console.log(`每页 ${val} 条`);*/
    },
    // 换页刷新
		refreshPageRequest: function (currPage) {
      this.pageRequest.currPage = currPage
      this.findPage()
    },
    // 修改
		handleEdit: function (index, row) {
      this.$emit('handleEdit', {index:index, row:row})
		},
    // 删除
		handleDelete: function (index, row) {
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code === 0) {
            this.$message({message: '删除成功', type: 'success'})
            this.findPage()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
		}
  },
  mounted() {
    this.refreshPageRequest(1)
    this.handleSizeChange(10)
  }
}
</script>

<style scoped>

</style>
