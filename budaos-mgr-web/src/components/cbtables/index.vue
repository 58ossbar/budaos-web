<template>
  <div>
    <!--表格栏-->
    <el-table :data="tableData.list" style="width: 100%" size="small" highlight-current-row
        @row-click="rowClick" @selection-change="selectionChange" :ref="name" v-loading="loading">

      <!--checkbox列-->
      <el-table-column type="selection" width="45" v-if="checkbox"></el-table-column>

      <!--数据列-->
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!--自定义列switch开关-->
          <!--<el-switch v-if="column.dataType == 'switch'" v-model="scope.column.formatter ? scope.column.formatter(scope.row, scope.column, scope.row[column.prop]) : scope.row[column.prop]" @change="dataTypeClick($event, scope.$index, scope.row, column.callback)" active-color="#13ce66" inactive-color="#ff4949">-->
          <el-switch v-if="column.dataType == 'switch'" v-model="scope.row[column.prop]" @change="dataTypeClick($event, scope.$index, scope.row, column.callback)" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
          <!--自定义列超链接-->
          <span v-else-if="column.dataType == 'link'" @click="dataTypeClick($event, scope.$index, scope.row, column.callback)" class="el-menu-item is-active" style="margin-left: -10px">
            {{formatterData(scope, column.prop)}}
          </span>
          <!--自定义列头像-->
          <el-popover v-else-if="column.dataType == 'image'" placement="right" title="" trigger="hover">
            <img :src="formatterData(scope, column.prop)" style="max-width: 300px; max-height: 300px"/>
            <img slot="reference" v-if="!column.type" style="width: 40px;height: 40px;display: block;border-radius: 50%"
               :src="formatterData(scope, column.prop)" @click="dataTypeClick($event, scope.$index, scope.row, column.callback)" />
            <img slot="reference" v-else-if="column.type == 2" :name="column.prop" :title="scope.row[column.title]"
                 :src="formatterData(scope, column.prop)" @click="dataTypeClick($event, scope.$index, scope.row, column.callback)"
                 :handleImg="handleImg(scope, column.prop, column)" />
          </el-popover>
          <!--自定义列tag标签-->
          <el-tag v-else-if="column.dataType == 'tag'" :name="column.prop" :id="scope.row[column.id ? column.id : ''] + '_tag'"
                  :type="handleTagType(scope, scope.row, column, scope.row[column.id ? column.id : ''] + '_tag', column.prop)"
                  :size="column.size ? column.size : 'mini'"
                  :effect="column.effect ? column.effect : 'plain'"
                  @click="dataTypeClick($event, scope.$index, scope.row, column.callback)"
          >{{formatterData(scope, column.prop)}}
          </el-tag>

          <!--默认普通列-->
          <span v-else>
            {{formatterData(scope, column.prop)}}
          </span>
        </template>
      </el-table-column>

      <!--操作列-->
      <el-table-column :label="$t('action.operation')" width="155" fixed="right" header-align="center" align="center" v-if="btnColumns && btnColumns.length > 0">
        <template slot-scope="scope" >
          <div v-if="btnColumns.length < 3">
            <cb-button v-for="btnColumn in btnColumns" :key="btnColumn.label" :icon="btnColumn.icon" :label="btnColumn.label" :perms="btnColumn.perms" type="primary"
                class="editButtonPost" @click="handleClick(scope.$index, scope.row, btnColumn.callback)"/>
          </div>
         <div v-else>
           <cb-button :icon="btnColumns[0].icon" :label="btnColumns[0].label" :perms="btnColumns[0].perms" type="primary"
                class="editButtonPost" @click="handleClick(scope.$index, scope.row, btnColumns[0].callback)"/>
           <el-dropdown class="tabs-tools" :show-timeout="0" trigger="click" ref="cbDropdown">
             <el-button size="mini" icon="fa fa-angle-down" type="primary" class="editButtonPost" ref="moreButton" >{{$t('action.more')}}</el-button>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;" v-for="(btnColumn,index) in btnColumns" :key="btnColumn.label" >
                 <cb-button  v-if="index > 0" :icon="btnColumn.icon" :label="btnColumn.label" :perms="btnColumn.perms"  class="treeHoverUlButtom"
                     @click="handleClick(scope.$index, scope.row, btnColumn.callback)"/>
               </el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>
         </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
      <cb-button size="small" type="primary" :label="$t('action.batchDelete')" style="float:left;" :perms="permsBatchDelete" v-if="this.selections.length > 0"
        @click="handleBatchDelete"/>

        <template v-if="otherBatchBtnColumns && otherBatchBtnColumns.length > 0 && this.selections.length > 0">
          <cb-button  v-for="btnColumn in otherBatchBtnColumns" :key="btnColumn.label" size="small" type="primary" :label="btnColumn.label" :perms="btnColumn.perms"  style="float:left;"  @click="handleOtherBatchClick(btnColumns.callback)"/>
        </template>

      <el-pagination  @current-change="refreshPageRequest"
                      @size-change="handleSizeChange"
                      :current-page="pageRequest.pageNum" :page-size="pageRequest.PageSize"
                      :page-sizes="pageRequest.pageSizes" :pager-count="pageRequest.pagerCount"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.totalCount" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>
<!--
  示例
      <cb-tables :parentVue="this._self" :tableData='tableData' permsBatchDelete="site:tevglsitepartner:remove" :columns="columns" :btnColumns="btnColumns"></cb-tables>
      注意
      parentVue：[Object]，传固定值this._self，不能改变，必传固定参数
      tableData：[Array]，表数据，必传
      name：[String]，多个table同时存在时，以该字段区分，获取表格组件方法：this.$refs.name，默认值为：table，可选参数，
      handleQueryDataName：[String]，获取表数据的方法名称，默认值为：findPage，名字相同可不传，可选参数
      handleBatchDeleteName：[String]，处理批量删除的方法名称，默认值为：handleBatchDelete，名字相同可不传，可选参数
      permsBatchDelete：[String]，批量删除按钮的权限标识，如果不需要该按钮，则不传，可选参数
      columns：[Array]，表头字段配置，与elementui配置一致，格外拓展两个属性,dataType和callback，必传参数
            dataType属性取值有：image：头像, image1:将以正方形显示图片；link：超链接；switch：开关
            callback回调函数，点击该自定义列数据时触发
        [
          {prop:"img", label:"图片", minWidth:120, dataType: "image1", callback: "imageClick", title='starName'},
          {prop:"starPic", label:"头像", minWidth:120, dataType: "image", callback: "imageClick"},
          {prop:"starName", label:"姓名", minWidth:200, dataType: "link", callback: "linkClick"},
          {prop:"starName", label:"性别", minWidth:70},
          {prop:"state", label:"首页显示", minWidth:100, dataType: "switch", callback: "switchClick", formatter: function(row, column, cellValue){
            return cellValue == '是' ? true : false
          }},

          /*tag标签示例*/
          {prop:"status", label:"状态", minWidth:60, dataType:'tag', type:'info', mapper:'{"key":"待审核", "value":"danger"}'},
          {prop:"status", label:"状态", minWidth:60, dataType:'tag', type:'success', id:'newsid', mapper:'[{"key":"待审核", "value":"danger"},{"key":"未通过", "value":"warning"}]'},

        ]
      btnColumns：[Array]，操作列中的按钮定义，数据格式为json数组，示例如下，如果不需要操作列，则不传
        [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitepartner:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitepartner:remove", callback: "handleDelete"},
          {icon: "fa fa-plus", label: "上移", perms: "site:tevglsitepartner:move", callback: "handleAdd"},
        ]
        otherBatchBtnColumns：[Array]， 选中列后 出现在 批量删除 一起的 的按钮定义，数据格式为json数组，示例如下，如果不需要其他批量操作，则不传
        [
          {icon: "fa fa-edit", label: "批量修改", perms: "site:tevglsitepartner:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "批量删除", perms: "site:tevglsitepartner:remove", callback: "handleDelete"},
          {icon: "fa fa-plus", label: "批量上移", perms: "site:tevglsitepartner:move", callback: "handleAdd"},
        ]
 -->
<script>
import CbButton from "@/views/Core/CbButton"

export default {
    name: 'cb-tables',
    props: {
      parentVue: {},
      name: {
        type: String,
        default: 'table'
      },
      handleQueryDataName: {
        type: String,
        default: 'findPage'
      },
      handleBatchDeleteName: {
        type: String,
        default: 'handleBatchDelete'
      },
      selectionChangeName: {
        type: String,
        default: 'selectionChange'
      },
      columns: {},
      btnColumns: {},
      otherBatchBtnColumns:{},
      tableData: {},
      permsBatchDelete: {},
      checkbox:{ // 是否需要多选
        type: Boolean,
        default:true
      },
    },//继承父组件中的id，name属性，拓展功能请在此配置
    components:{
      CbButton
    },
    data() {
      return {
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
      //自定义列增加formatter格式化函数
      formatterData: function(scope, prop){
        return scope.column.formatter ? scope.column.formatter(scope.row, scope.column, scope.row[prop]) : scope.row[prop];
      },
      //操作栏按钮回调事件
      handleClick: function(index, row, callback){
        // 处理-表格行的选中效果
        this.$refs.table.clearSelection(); // 先清除选中效果
        this.$refs.table.toggleRowSelection(row); // 再重新选中当前选中的行
        if(callback){
          this.parentVue[callback]({index:index, row:row})
        }
      },
      // 点击表格中的行触发该事件
      rowClick: function(row, column, event){
        this.$refs[this.name].toggleRowSelection(row);
      },
      // 选择切换
      selectionChange: function (selections) {
        this.selections = selections
        if (this.parentVue[this.selectionChangeName]){
          this.parentVue[this.selectionChangeName]({selections:selections, vue:this})
        }
      },
      //选择分页栏中页数
      handleSizeChange: function(val) {
        this.pageRequest.PageSize=val;
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.pageRequest.pageNum=1;
        this.findPage();
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum;
        this.findPage()
      },
      //查询
      findPage: function(){
        this.loading = true;
        let callback = res => {
          this.loading = false
        };
        this.parentVue[this.handleQueryDataName]({pageRequest:this.pageRequest, callback:callback})
      },
      // 批量删除
      handleBatchDelete: function () {
        this.parentVue[this.handleBatchDeleteName]({params:this.selections})
      },
      // 其他批量 按钮 点击
      handleOtherBatchClick: function (callback) {
        if(callback){
          this.parentVue[callback]({params:this.selections})
        }
      },
      //表格列中自定义标签的点击事件
      dataTypeClick: function(e, index, row, callback){
        if(callback){
          this.parentVue[callback]({e: e, index: index, row: row});
        }
      },
      handleImg:function(scope, prop, column){
        this.$nextTick(function(){
          let imgs = document.getElementsByName(prop)
          if (imgs != null ){
            if (column.imgWidth && column.imgHeight){
              for(let i=0; i<imgs.length; i++){
                imgs[i].style.width = column.imgWidth;
                imgs[i].style.height = column.imgHeight;
                imgs[i].style.display = 'block'
                let value = imgs[i].style.width.substring(imgs[i].style.width.length, imgs[i].style.width.length-2);
                if (value == value.toLocaleLowerCase('px')){
                  imgs[i].style.width = Number(imgs[i].style.width.substring(0, imgs[i].style.width.length-2)) - 10 + 'px'
                }
              }
            } else {
              for(let i=0; i<imgs.length; i++){
                imgs[i].style.width = '150px'
                imgs[i].style.height = '40px'
                imgs[i].style.display = 'block'
              }
            }
          }
        })
      },

      // 处理el-tag标签的type树形
      handleTagType:function (scope, row, column, id, name) {

        this.$nextTick(function () {
          if (column.mapper){
            let propJSON = JSON.parse(column.mapper)
            if (propJSON.length > 0){ // 多个的情况
              propJSON.forEach(a => {
                if (id){
                  let tag = document.getElementById(id)
                  if (tag){
                    if (tag.innerText === a.key){ // 特别标注的
                      tag.classList.add('el-tag--'+a.value)
                      setTimeout(function () {
                        tag.classList.remove('el-tag--'+column.type)
                      })
                    } else { // 普通的
                      tag.classList.add('el-tag--'+column.type)
                      setTimeout(function () {
                        tag.classList.remove('el-tag--'+a.value)
                      })
                    }
                  }
                }
              })
            } else { // 单个的情况
              let tags = document.getElementsByName(name);
              if (tags.length > 0){
                tags.forEach(a => {
                  if (a.innerText === propJSON.key){
                    a.classList.add('el-tag--'+propJSON.value) // 添加样式
                    a.classList.remove('el-tag--'+column.type) // 删除样式
                  } else {
                    a.classList.add('el-tag--'+column.type)
                    a.classList.remove('el-tag--'+propJSON.value) // 添加样式
                  }
                })
              }
              //if (row[column.prop] == propJSON.key){}
            }
          } else {
            let tags = document.getElementsByName(name);
            if (tags.length > 0){
              tags.forEach(a => {
                a.classList.add('el-tag--'+column.type)
              })
            }
          }
        })
      },
    },
    watch: {

    },
    mounted() {
      this.refreshPageRequest(1);
      this.parentVue.$refs[this.name] = this.$refs[this.name]
    }
  }
</script>

<style scoped>

</style>
