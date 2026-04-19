<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="300px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <!--过滤输入框-->
          <el-input class="buttomMargin"  size="small" placeholder="输入名称查询" v-model="filterText"
                    suffix-icon="el-icon-search" clearable  maxlength="30" type="text" >
          </el-input>
          <cb-button class="queryButtonPlus" icon="el-icon-plus" perms="forum:tevglforumfriendtype:add"
                     title="添加一级分类"
                     type="primary"  @click="handleAddFriendType"/>
        </div>
        <el-tree
          class="filter-tree"
          node-key="typeId"
          :data="treeData"
          :props="defaultProps"
          ::default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          highlight-current
          @node-click="nodeClick"
          @node-contextmenu="nodeContextMenu"
          ref="tree">
        </el-tree>
      </el-aside>
      <el-container>
        <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>名称</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.friendName" placeholder="名称" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>博客首页显示</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="请选择首页显示" name="showIndex" dict="state3" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="请选择状态" name="state" dict="state4" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')" perms="forum:tevglforumfriend:query" type="primary" @click="findPage(null)"/>
                <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="forum:tevglforumfriend:add" type="primary" @click="handleAdd" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-tables :parentVue="this._self" permsBatchDelete="forum:tevglforumfriend:delete"
                     :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
          </cb-tables>
        </el-main>
      </el-container>

    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglForumFriend"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="所属分类" prop="friendType">
            <!--<el-cascader class="widthAll" v-model="dataForm.friendTypeList" :options="optionList" :show-all-levels="false" :props="{value: 'typeId', label: 'name', children: 'children'}"></el-cascader>-->
            <cb-tree url='/api/forum/tevglforumfriendtype/getTree' :parentVue="this._self" placeholder="请选择所属分类" name="friendType" prop='{"id":"typeId", "name":"name"}' :dataForm="dataForm"></cb-tree>
          </el-form-item>
          <el-form-item label="名称" prop="friendName">
            <el-input v-model="dataForm.friendName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="friendUrl">
            <el-input v-model="dataForm.friendUrl" auto-complete="off" placeholder="示例：https://www.budaos.com"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="friendSummary">
            <el-input type="textarea" :rows="4" v-model="dataForm.friendSummary" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="缩略图" prop="friendLogo">
            <div style="float: left">
              <cb-upload type="24" name="friendLogo" :dataForm="dataForm" placeholder="上传缩略图" title="点击上传PC端图片"></cb-upload>
            </div>
            <!--<div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 1920*450 最佳</el-tag></div>-->
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <cb-dict :parentVue="this._self" placeholder="状态" name="state" dict="state4" type="select" :dataForm="dataForm" :disabled="operation"></cb-dict>
          </el-form-item>
          <el-form-item label="首页显示" prop="showIndex">
            <cb-dict :parentVue="this._self" placeholder="状态" name="showIndex" dict="state3" type="select" :dataForm="dataForm"></cb-dict>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>

    <!--新增修改分类界面-->
    <el-dialog v-dialogDrag :title="operationForType?'新增分类':'修改分类'"  top="5vh" width="50%" :visible.sync="dialogVisibleForType" :close-on-click-modal="false">
      <el-form :model="dataFormForType" label-width="100px" ref="dataFormForType" :rules="dataTevglForumFriendType"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataFormForType.name" auto-complete="off" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <icon-select :prop="dataFormForType.icon"
                         @currentChangeHandle="currentChangeHandle"
                         @changeProp="changeIcon">
            </icon-select>
          </el-form-item>

        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="父级分类" prop="parentId">
            <el-input v-model="dataFormForType.parentId" auto-complete="off" disabled v-if="dataFormForType.parentId == '0'"></el-input>
            <cb-tree v-else url='/api/forum/tevglforumfriendtype/getTree' :parentVue="this._self"
                     placeholder="请选择所属分类" name="parentId"
                     prop='{"id":"typeId", "name":"name"}' :dataForm="dataFormForType"></cb-tree>
            <!--<el-select class="widthAll" v-model="dataFormForType.parentId" placeholder="请选择父级分类" v-else>
              <el-option
                v-for="item in treeData"
                :key="item.typeId"
                :label="item.name"
                :value="item.typeId"
                :disabled="item.disabled">
              </el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="排序号" prop="sortNum">
            <el-input-number class="widthAll" v-model="dataFormForType.sortNum" step-strictly :min="1"></el-input-number>
          </el-form-item>
        </div>
        <div style="width: 98%; float:left;">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataFormForType.remark" :rows="2" auto-complete="off" maxlength="500"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleForType = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operationForType" :size="size" type="primary" @click.native="saveFriendType('saveContinue')"  :loading="editLoadingForType">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="saveFriendType"  :loading="editLoadingForType">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "../../utils/global";
import IconSelect from "@/components/IconSelect";

export default {
    components:{
      CbButton,
      IconSelect
    },
    data() {
      return {
        typeId: '',
        optionList: [],
        filterText: '',
        treeData: [],
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogVisibleForType: false,
        operationForType: false, // true:新增, false:修改
        editDialogVisibleForType: false, // 新增修改界面是否显示
        editLoadingForType: false,
        dataFormForType: {
          typeId: '', //主键
          parentId: '', //parentId
          name: '', //名称
          icon: '', //图标
          sortNum: '', //排序号
          remark: '', //备注
        },
        dataTevglForumFriendType: {
          name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        },

        dataTevglForumFriend: {
          friendName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
          friendType: [{ required: true, message: "分类不能为空", trigger: "blur" }],
          friendUrl: [{ required: true, message: "链接不能为空", trigger: "blur" }],
          friendLogo: [{ required: true, message: "缩略图不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          friendId: '', //主键ID
          friendName: '', //版块名称
          friendSummary: '', //版块简介
          friendUrl: '', //网络链接
          friendLogo: '', //版块缩略图
          state: 'Y', //状态(Y启用N禁用)
          friendType: '',
          friendTypeList: [],
          showIndex: 'N'
        },
        columns: [
          {prop:"friendLogo", label:"缩略图", minWidth:70, dataType: 'image'},
          {prop:"friendName", label:"名称", minWidth:70},
          {prop:"friendTypeName", label:"分类", minWidth:70},
          {prop:"friendUrl", label:"链接", minWidth:70, dataType: 'link', callback: 'link'},
          {prop:"friendSummary", label:"简介", minWidth:70},
          {prop:"createUserId", label:"创建人", minWidth:70},
          {prop:"createTime", label:"创建时间", minWidth:70},
          {prop:"showIndex", label:"博客首页显示", minWidth:70, dataType: 'switch', callback: 'switchClickShowIndex'},
          {prop:"state", label:"状态", minWidth:70, dataType: 'switch', callback: 'switchClick'},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "forum:tevglforumfriend:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "forum:tevglforumfriend:delete", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
      }
    },
    methods: {
      switchClickShowIndex(data){
        let obj = {}
        obj.friendId = data.row.friendId
        if (data.e == true){
          obj.showIndex = "Y"
        } else {
          obj.showIndex = "N"
        }
        this.$api.tevglforumfriend.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: res.msg, type: "success" });
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      },
      switchClick (data) {
        let obj = {}
        obj.friendId = data.row.friendId
        if (data.e == true){
          obj.state = "Y"
        } else {
          obj.state = "N"
        }
        this.$api.tevglforumfriend.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: res.msg, type: "success" });
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      },
      link (item) {
        let data = item.row
        window.open(data.friendUrl, '_blank')
      },
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevglforumfriend.findPage(jj).then((res) => {
          res.data.list.forEach(item => {
            item.friendLogo = baseUrl + item.friendLogo
            // 切换值，便于表格组件switch开关
            if (item.state == "有效"){
              item.state = true
            } else if (item.state == "无效"){
              item.state = false
            }
            if (item.showIndex == "显示"){
              item.showIndex = true
            } else if (item.showIndex == "隐藏"){
              item.showIndex = false
            }
          })
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.friendId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].friendId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglforumfriend.doDelete(jj).then(res => {
            if(res.code!==0){//删除失败
              this.$message.error(res.msg);
              return;
            }else{
              this.$message({ message: "操作成功", type: "success" });
              this.findPage(null);
            }
          }).then(darass!=null?darass.callback:'').catch(res => {
            this.$message.error("删除失败，请联系管理员!");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 显示新增界面
      handleAdd: function () {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate()
          this.$refs['dataForm'].resetFields()
        }
        this.dialogVisible = true
        this.operation = true
        this.dataForm.friendType = this.typeId
      },
      // 显示修改界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglforumfriend.view(params.row.friendId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.friendTypeList = [this.dataForm.friendType]
          }
        });
      },
      // 修改
      submitForm: function (type) {
        // 赋值
        this.dataForm.friendType = this.dataForm.friendTypeList[this.dataForm.friendTypeList.length-1]
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglforumfriend.save(params).then((res) => {
                if(res.code == 0) {
                  this.$message({ message: '操作成功', type: 'success' })
                  if(type == "saveContinue"){
                    this.$refs['dataForm'].resetFields()
                  }
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible = false
                this.findPage()
              })
            })
          }
        })
      },
      queryTypeList (node, id) {
        this.$api.tevglforumfriend.getTree({flag:'x'}).then(res => {
          if (res.code == 0) {
            this.optionList = JSON.parse(JSON.stringify(res.data)) // 避免下值引用的问题
            this.treeData = res.data
            this.treeData.forEach(item => {
              item.id = item.typeId
              /*if ('N' == item.canAddNode) {
                item.disabled = true
              }*/
            })
            this.$nextTick(() => {
              if (node) {
                this.$refs.tree.setCurrentKey(node.data.id, node)
                if (id) {
                  this.$refs.tree.setCurrentKey(id, this.$refs.tree.getNode(id))
                }
              }
            })
          }
        })
      },
      saveFriendType (type){
        this.$refs.dataFormForType.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoadingForType = true;
              this.dataFormForType.parentId = this.dataFormForType.parentId == '' ? '0' : this.dataFormForType.parentId
              let params = Object.assign({}, this.dataFormForType);
              this.$api.tevglforumfriendtype.save(params).then((res) => {
                if(res.code == 0) {
                  this.$message({ message: '操作成功', type: 'success' })
                  if(type == "saveContinue"){
                    this.dataFormForType = {
                      typeId: '', //主键
                      parentId: params.parentId, //parentId
                      name: '', //名称
                      icon: '', //图标
                      sortNum: '', //排序号
                      remark: '', //备注
                    }
                    this.getMaxSortNum({parentId: params.parentId})
                    this.dataForm.friendTypeList = [res.data]
                  }
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoadingForType = false
                this.$refs['dataFormForType'].resetFields()
                // 关闭页面
                this.dialogVisibleForType = type == 'saveContinue' ? true : false
                // 重新加载树
                this.queryTypeList(this.$refs.tree.getNode(params.parentId), res.data)
                // 展开节点
                this.$refs.tree.store.defaultExpandedKeys = [params.parentId]
              })
            })
          }
        })
      },

      // 添加分类
      handleAddFriendType () {
        if(this.$refs['dataFormForType']){
          this.$refs['dataFormForType'].clearValidate()
          this.$refs['dataFormForType'].resetFields()
        }
        this.operationForType = true
        this.dialogVisibleForType = true
        this.dataFormForType.typeId = ''
        this.getMaxSortNum({parentId: '0'})
      },
      nodeClick (item) {
        this.filters.friendType = item.typeId
        this.findPage()
        this.hideMenu()
        this.dataForm.friendTypeList = [item.typeId]
        this.typeId = item.typeId
      },
      filterNode (value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      changeIcon (val) {
        this.dataFormForType.icon = val
      },
      currentChangeHandle (params) {
        this.dataFormForType.icon = params.data;
        //this.iconProp = this.dataForm.icon;
      },

      /**
       * 鼠标右键触发事件
       * @param event
       * @param data
       * @param node
       * @param compent
       */
      nodeContextMenu (event, data, node, compent) {
        this.typeId = data.typeId
        // 查询友链
        this.filters.friendType = data.typeId
        this.findPage()
        // 高亮选中右键节点
        this.$refs.tree.setCurrentKey(data.typeId, node)
        let o1 = {
          name: "新增分类",
          onClick: (event) => {
            this.hideMenu()
            this.dialogVisibleForType = true
            this.operationForType = true
            if(this.$refs['dataFormForType']){
              this.$refs['dataFormForType'].clearValidate()
              this.$refs['dataFormForType'].resetFields()
            }
            this.dataFormForType= {
              typeId: '', //主键
              parentId: data.typeId,
              name: '', //名称
              icon: '', //图标
              sortNum: '', //排序号
              remark: '', //备注
            },
            this.getMaxSortNum({parentId: data.typeId})
          },
        }
        let o2 = {
          name: "修改分类",
          onClick: (event) => {
            this.hideMenu()
            this.operationForType = false
            this.dialogVisibleForType = true
            this.$api.tevglforumfriendtype.view(data.typeId).then((res) => {
              if (res.code == 0){
                this.dataFormForType = Object.assign({}, res.data);
              }
            });
          },
        }
        let o3 = {
          name: "删除分类",
          onClick: (event) => {
            this.hideMenu()
            /*if ('N' == data.canAddNode && data.children && data.children.length > 0) {
              this.$message({ message: '请先去删除【'+data.name+'】分类下的友链', type: 'warning' })
              return false
            }*/
            if (data.children && data.children.length > 0) {
              this.$message({ message: '请先删除【'+data.name+'】分类下的子分类', type: 'warning' })
              return false
            }
            this.$confirm('确认删除分类【'+data.name+'】，以及其下的友链吗？', "提示", {
              type: "warning",
              closeOnClickModal:false
            }).then(() => {
              this.$api.tevglforumfriendtype.doDelete([data.typeId]).then(res => {
                if (res.code == 0) {
                  this.$message({ message: "操作成功", type: "success" });
                  // 重新加载树
                  this.queryTypeList(this.$refs.tree.getNode(data.parentId))
                  // 展开被删除节点的父节点
                  this.$refs.tree.store.defaultExpandedKeys = [data.parentId]
                } else {
                  this.$message.error(res.msg);
                }
                this.findPage(null)
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
        }
        let o4 = {
          name: "添加友链",
          onClick: (event) => {
            this.dataForm.friendTypeList = [data.typeId]
            this.handleAdd()
            this.hideMenu()
          },
        }
        let arr = []
        // 如果一级分类下已经有友链了，则不允许添加子分类
        /*if ('Y' == data.canAddNode) {
          arr.push(o1)
        }*/
        // 放入数组
        arr.push(o1)
        arr.push(o2)
        arr.push(o3)
        arr.push(o4)
        /*if ('N' == data.canAddNode || 'Y' == data.canAddLink) {
          arr.push(o4)
        }*/
        let options = {
          menus: arr
        }
        this.createMenu(options)
        // 显示右键菜单
        this.showMenu(event)
      },
      createMenu: function (options) {
        const body = document.querySelector("body");
        let ele = document.querySelector('.custom-context-menu')
        if (ele) {
          body.removeChild(ele)
        }
        const ul = document.createElement("ul");
        ul.classList.add("custom-context-menu");
        const { menus } = options;
        if (menus && menus.length > 0) {
          for (let menu of menus) {
            const li = document.createElement("li");
            li.textContent = menu.name;
            li.onclick = menu.onClick;
            ul.appendChild(li);
          }
        }
        body.appendChild(ul);
        return ul;
      },
      /**
       * 显示右键菜单
       */
      showMenu: function (e) {
        e.preventDefault();
        //const menus = this.contextMenu.getInstance();
        const menus = document.querySelector('.custom-context-menu')
        menus.style.top = `${e.clientY}px`;
        menus.style.left = `${e.clientX}px`;
        menus.classList.remove("hidden");
      },
      /**
       * 隐藏右键菜单
       */
      hideMenu: function (event) {
        if (this.contextMenu) {
          //const menus = this.contextMenu.getInstance();
        }
        const menus = document.querySelector('.custom-context-menu')
        if (menus) {
          menus.classList.add("hidden");
        }
      },
      getMaxSortNum(params){
        this.$api.tevglforumfriendtype.getMaxSortNum(params).then((res) => {
          if (res.code == 0){
            this.dataFormForType.sortNum = res.data
          }
        });
      }
    },
    mounted() {
      this.queryTypeList()
      document.addEventListener("click", this.hideMenu);
    }
  }
</script>

<style scoped>

</style>
