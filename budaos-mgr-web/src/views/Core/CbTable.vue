<template>
  <div>
    <!--表格栏-->

    <el-table v-if="data.list" :data="data.list" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
              @row-click="rowClick" ref="table" :isOpen="isOpen" :cbid="cbid"
              @select="select" :showUserName="showUserName" @cell-click="cellClick"
          @current-change="handleCurrentChange"  :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe"
          :show-overflow-tooltip="showOverflowTooltip" v-loading="loading" :size="size"   :align="align" style="width:100%;" >
      <el-table-column type="selection" width="45" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column prop="userRealname" label="真实姓名" v-if="showImg" width="100">
                    	<template slot-scope="scope">
                    		<span class="el-menu-item is-active" style="margin-left: -10px">{{scope.row.userRealname}}</span>
                    	</template>
      </el-table-column>
      <el-table-column prop="userimg" label="头像" v-if="showImg" width="80">
                    	<template slot-scope="scope">
                    		<img :src="scope.row.userimg" style="width: 40px;height: 40px;display: block;border-radius: 50%"/>
                    	</template>
      </el-table-column>
      <el-table-column prop="pic" :label="showPicLable" v-if="showPic" width="80">
            	<template slot-scope="scope">
            		<img v-if="scope.row.picValue != ''" :src="scope.row.pic" style="width: 40px;height: 40px;display: block;border-radius: 50%"/>
            	</template>
      </el-table-column>
      <el-table-column prop="postType" v-if="postShowType" header-align="center" align="center" label="岗位类型" width="100">
        <template slot-scope="scope">
          <el-tag v-for="item in queryFormDefault" v-if="scope.row.postType === item.label"
                  size="small" :key="item.label" :type="item.type">{{item.label}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
                       :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
                       :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
                       :sortable="column.sortable==null?true:column.sortable" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column :label="$t('action.operation')" width="155" fixed="right" v-if="showOperation" header-align="center" align="center">

        <template slot-scope="scope" >
          <div v-if="permsLength<3">
            <!--<el-tooltip class="item" effect="dark" content="修改" placement="left">
           <i class="el-icon-edit" v-if="hasPerms(permsEdit)" @click="handleEdit(scope.$index, scope.row)"
              style="cursor:pointer; margin: 0 2px;font-size:1.3em;vertical-align: middle;"></i>
         </el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" content="删除" placement="right">
              <i class="el-icon-delete" v-if="hasPerms(permsDelete)" @click="handleDelete(scope.$index, scope.row)" style="cursor:pointer; margin: 0 2px; font-size:1.3em;vertical-align: middle;"></i>
            </el-tooltip>-->
            <cb-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" type="primary" class="editButtonPost"
                       @click="handleEdit(scope.$index, scope.row)" />
            <cb-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete"  class="editButtonPost"
                       type="primary" @click="handleDelete(scope.$index, scope.row)" />
          </div>
         <div v-else>
           <cb-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" type="primary" class="editButtonPost"
                      @click="handleEdit(scope.$index, scope.row)" />

           <el-dropdown class="tabs-tools" :show-timeout="0" trigger="click" ref="cbDropdown">
             <el-button size="mini" icon="fa fa-angle-down"   type="primary" class="editButtonPost" ref="moreButton" @click="moreButton($event, scope.$index, scope.row,{moveUp:'0'})">{{$t('action.more')}}</el-button>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                 <cb-button  icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete"  class="treeHoverUlButtom"
                     @click="handleDelete(scope.$index, scope.row)" />
               </el-dropdown-item>
               <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                 <cb-button icon="fa fa-long-arrow-up" :label="$t('action.moveUp')" :perms="permsMove"  class="treeHoverUlButtom"
                            v-if="scope.$index!==0"    @click="handleMove(scope.$index, scope.row,{moveUp:'0'}, $event)" />
               </el-dropdown-item>
               <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                 <cb-button icon="fa fa-long-arrow-down" :label="$t('action.moveDown')" :perms="permsMove"  class="treeHoverUlButtom"
                            v-if="scope.$index+1!==data.list.length"   @click="handleMove(scope.$index, scope.row,{moveDown:'0'}, $event)" />
               </el-dropdown-item>
               <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                 <cb-button  icon="fa fa-low-vision" :label="$t('action.view')" :perms="permsView"  class="treeHoverUlButtom"
                             @click="handleView(scope.$index, scope.row)" />
               </el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>




         </div>
        </template>
      </el-table-column>
      <!--是否开启Switch 开关-->
      <el-table-column prop="status" label="状态" v-if="isShow" width="60">
        <template slot-scope="scope">
          <!--<el-switch v-model="scope.row.status" @change="switchChange($event, scope.$index, scope.row)" active-color="#13ce66" inactive-color="#ff4949">-->
          <el-switch v-model="scope.row.status" @change="switchChange($event, scope.$index, scope.row)"
                     :active-value="activeValue" :inactive-value="inactiveValue"
                     :active-text="activeText" :inactive-text	="inactiveText"
                     active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
      <cb-button :label="$t('action.batchDelete')" :perms="permsDelete"  :size="size" type="primary" @click="handleBatchDelete()"
        :disabled="this.selections.length===0" style="float:left;" v-if="showBatchDelete & showOperation & isShowBatchDelete"/>
      <el-pagination  @current-change="refreshPageRequest"
                      @size-change="handleSizeChange"
                      :current-page="pageRequest.pageNum" :page-size="pageRequest.PageSize"
                      :page-sizes="pageRequest.pageSizes" :pager-count="pageRequest.pagerCount"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="data.totalCount" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import {hasPermission} from '@/permission/index.js'

export default {
  name: 'CbTable',
  components:{
			CbButton
	},
  props: {
    columns: Array, // 表格列配置
    queryFormDefault: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 修改权限标识\
    permsDelete: String,  // 删除权限标识
    permsMove:String,
    permsView : String, // 查看明细权限标识
    size: { // 尺寸样式
      type: String,
      default: 'mini'
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
    showImg:{  // 显示图片
      type: Boolean,
      default: false
    },
    showPic:{  // 显示图片
      type: Boolean,
      default: false
    },
    showPicLable : {
      type: String,
      default: "图片"
    },
    postShowType:{  // 显示岗位类型
      type: Boolean,
      default: false
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
    },
    isOpen:{
      type: Boolean,
      default: false
    },
    showUserName:{
      type: Boolean,
      default: false
    },
    cbid:{
      type: String,
      default: ''
    },

    // 是否开启switch开关
    isShow : { type: Boolean, default: false },
    // switch 打开时的值
    activeValue : { type: String, default: '1' },
    // switch 关闭时的值
    inactiveValue : { type: String, default: '0'},
    // switch 打开时的文字描述
    activeText : { type: String, default: '' },
    // switch 关闭时的文字描述
    inactiveText : { type: String, default: ''  },
    rowKey: {  // 文本对齐方式
      type: String,
      default: ''
    },
    isShowBatchDelete : { type: Boolean, default: true }, // 是否显示左下角批量删除按钮

  },
  data() {
    return {
      perms:{
      },//所有权限标识
      permsLength:0,
      // 分页信息
      pageRequest: {
        PageSize: 10,//一页显示几条  limit
        pageNum: 1,//当前页码  page
        pageSizes:[10, 20, 30, 40],
        pagerCount:5,//显示几个页数按钮
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    // 分页查询
    findPage: function () {
        this.loading = true;
        let callback = res => {
          this.loading = false
        };
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    hasPerms: function (perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      this.$emit('selectionChange', {selections:selections, vue:this.$refs.table})
    },
    handleSizeChange: function(val) {
      this.pageRequest.PageSize=val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageRequest.pageNum=1;
      this.findPage();
      /*console.log(`每页 ${val} 条`);*/
    },
    // 换页刷新
    refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum;
      this.findPage()
    },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', {val:val})
    },
    // 修改
		handleEdit: function (index, row) {
      this.$refs.table.clearSelection(); // 先清空所有的选择
      this.$refs.table.toggleRowSelection(row); // 重新选中当前行
      this.$emit('handleEdit', {index:index, row:row, tableVue:this.$refs.table})
		},
    handleMove:function(index, row, moves, event){
      this.$emit('handleMove', {row:row,index:index,moves:moves, event})
    },
    // 删除
		handleDelete: function (index, row) {
      this.$refs.table.clearSelection(); // 先清除所有选中项目
      this.$refs.table.toggleRowSelection(row); // 再重新选中
      if(row.id){
        this.delete(row.id, row)
      }else{
        this.$emit('handleDeleteOther', {obj:row, vue:this.$refs.table});
      }

		},
		// 批量删除
		handleBatchDelete: function () {
      if(this.selections.length<1){
        this.$message({message: "请选择一条记录", type: 'warning'});
      }else{
        if(this.selections[0].id){
          let ids = this.selections.map(item => item.id).toString()
          this.delete(ids)
        }else{
          this.$emit('handleBatchDelete', {params:this.selections})
          this.$emit('handleDeleteOther', {params:this.selections, vue:this.$refs.table});
          this.$emit('handleBatchDeleteOther', {params:this.selections, vue:this.$refs.table})
        }
      }
		},
		// 删除操作
		delete: function (ids, row) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning',
        closeOnClickModal:false
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',');
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code == 0) {
            this.$message({message: '删除成功', type: 'success'})
            this.findPage()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback, obj:row})
			}).catch(() => {
        this.$refs.table.clearSelection(); // 清除表格所有选中项
			})
		},
    // 点击表格中的行触发该事件
    rowClick:function(row, column, event){
      if (this.isOpen){
        if (column.property == "status"){ // 如果点击的是switch开关之状态一栏，则不让它触发
          return false;
        }
        if (column.label == "操作"){ // 如果点击的是操作一栏 // todo
          if (event.target.innerText == "更多"){
            //return false;
            this.$refs.table.clearSelection();
          }
        }
        this.$refs.table.toggleRowSelection(row); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        // row,column,obj,list某些地方可能用到
        this.$emit('toggleRowSelection', {row:row, column:column, obj:row, list:this.selections,vue:this.$refs.table});
      }

    },
    cellClick:function(row, column, cell, event){
      if(this.showUserName && (column.label=='姓名' || column.label == '真实姓名')){
        this.$emit('ReadName', {row:row});
      }
    },
    select : function(selection, row){},
    // switch 状态发生变化时的回调函数
    switchChange:function(e, index, data){
      this.$emit('switchChange', {e:e, index:index, data:data});
    },

    /**
     * 查看明细
     * @param index 下标
     * @param row 当前对象
     */
    handleView(index, row){
      this.$emit('handleView', index, row);
    },

    /**
     * 表格列中更多按钮触发事件
     * @param event
     * @param index
     * @param row
     * @param data
     */
    moreButton(event, index, row, data){

    },

  },
  mounted() {
    this.refreshPageRequest(1);
    this.$nextTick(function(){
      if(this.permsEdit){
        this.perms.permsEdit=this.permsEdit
      }
      if(this.permsDelete){
        this.perms.permsDelete=this.permsDelete
      }
      if(this.permsMove){
        this.perms.permsMove=this.permsMove
      }
      // 查看明细
      if(this.permsView){
        this.perms.permsView = this.permsView;
      }
      this.permsLength=Object.keys(this.perms).length;
    })
  }
}
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0px;
  }


</style>
