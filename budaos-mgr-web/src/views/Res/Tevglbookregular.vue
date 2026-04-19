<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="350px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <!--过滤输入框-->
          <el-input class="buttomMargin"  size="small" placeholder="输入名称查询" v-model="filterText"
                    suffix-icon="el-icon-search" clearable  maxlength="30" type="text" >
          </el-input>
        </div>
        <el-tree
          class="filter-tree"
          node-key="id"
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

        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <table border="1" class="table table-bordered cb-table" id="myTable" v-if="type === '01'"></table>

          <!--<el-table ref="myTable"
            border style="width: 100%">
            <el-table-column prop="regularSort" label="序号" width="180"></el-table-column>
            <el-table-column prop="name" label="考核人" width="180"></el-table-column>
            <el-table-column prop="address" label="考核指标" width="180">
              <el-table-column prop="name" label="文档" width="180">
                <el-table-column prop="name" label="需求说明书" width="100">
                  <el-table-column prop="name" label="5分" width="100"></el-table-column>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="name" label="功能实现" width="100"></el-table-column>
              <el-table-column prop="name" label="项目演示" width="100"></el-table-column>
            </el-table-column>
            <el-table-column prop="name" label="最终得分" width="180"></el-table-column>
          </el-table>-->
          <el-form ref="dataForm" :model="dataForm" :rules="dataTevglBookRegular" label-width="100px" size="small" label-position="left" class="regular-form"
                   v-if="type == '02' || type == '03'">
            <el-form-item label="课程名称">
              <el-input v-model="tevglBookSubject.subjectName" disabled></el-input>
            </el-form-item>
            <el-form-item label="总规则名称" v-show="type == '03'">
              <el-select v-model="dataForm.parentId" placeholder="请选择总规则名称" class="widthAll">
                <el-option v-for="item in zongRegularList" :key="item.regularId" :label="item.regularName" :value="item.regularId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则名称" prop="regularName" >
              <el-input v-model="dataForm.regularName" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="规则分数" v-show="type == '03'">
              <el-input-number v-model="dataForm.regularSum" @change="changeRegularSum" :min="0" :max="100" :precision="0" controls-position="right" label="请输入规则分数" class="widthAll"></el-input-number>
            </el-form-item>
            <el-form-item label="排序序号" v-if="!operation">
              <el-input-number class="widthAll" v-model="dataForm.regularSort" controls-position="right" label="请输入排序号"></el-input-number>
            </el-form-item>
            <el-form-item label="规则说明">
              <el-input type="textarea" v-model="dataForm.regularDesc" rows="8"></el-input>
            </el-form-item>
            <el-form-item size="large">
              <el-button type="primary" @click="submitForm" size="small">保存</el-button>
              <el-button v-if="operation" type="primary" @click="saveContinue" size="small">保存并继续</el-button>
            </el-form-item>
          </el-form>

        </el-main>
      </el-container>

    </el-container>

  </div>
</template>

<script>

import CbButton from "@/views/Core/CbButton"

export default {
    components:{
      CbButton
    },
    data() {
      return {
        // 当前被复制的课程节点
        copySubjectId: '',
        // 当前被粘贴的课程节点
        pasteSubjectId: '',
        instance: {},
        contextMenu: null,
        // 某课程下一级规则
        zongRegularList: [],
        // 左侧当前选中的节点
        treeNode: {},
        tevglBookSubject: {},
        regularList: [],
        type: '',
        filterText: '',
        treeData: [],
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },

        dataTevglBookRegular: {
          regularName: [{ required: true, message: "考核规则名称不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          regularId: '', //主键id
          subjectId: '', //课程id
          parentId: '', //父级id
          regularName: '', //考核规则名称
          regularSum: '', //考核规则分
          regularSort: '', //排序号
          regularType: '', //考核规则分类
          regularDesc: '', //规则说明
        },
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
      }
    },
    watch: {

    },
    methods: {
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

      nodeClick (data, node, commpent) {
        if (data.type != '01') {
          this.dialogVisible = false
        }
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
          this.$refs['dataForm'].resetFields()
        }
        this.operation = false
        this.viewRegular(data)
        this.hideMenu()
      },

      /**
       * 鼠标右键触发事件
       * @param event
       * @param data
       * @param node
       * @param compent
       */
      nodeContextMenu (event, data, node, compent) {
        //event.target.style.backgroundColor = 'rgba(64,158,255,0.2)'
        // 调用接口获取数据
        this.viewRegular(data)
        // 高亮选中
        this.$refs.tree.setCurrentKey(data.id, node)
        let arr = []
        let o1 = {
          name: "新增子节点",
          onClick: (event) => {
            // 标识为新增
            this.operation = true
            this.treeNode = data
            // 如果右键的课程节点
            if (data.type == '01') {
              this.type = '02'
              if(this.$refs['dataForm']){
                this.$refs['dataForm'].clearValidate()
                this.$refs['dataForm'].resetFields()
              }
              this.tevglBookSubject.subjectName = data.name
              this.dataForm.regularId = ''
              this.dataForm.regularName = ''
              this.dataForm.regularDesc = ''
              this.dataForm.regularSort = ''
              this.dataForm.regularSum = ''
              this.dataForm.subjectId = data.id
              this.dataForm.parentId = '-1'
              // 高亮选中当前节点
              this.$refs.tree.setCurrentKey(data.id, data)
            }
            if (data.type == '02') {
              this.type = '03'
              if(this.$refs['dataForm']){
                this.$refs['dataForm'].clearValidate()
                this.$refs['dataForm'].resetFields()
              }
              //this.dataForm.subjectId = data.id
              this.dataForm.regularId = ''
              this.dataForm.regularName = ''
              this.dataForm.regularDesc = ''
              this.dataForm.regularSort = ''
              this.dataForm.regularSum = ''
              this.dataForm.parentId = data.id
            }
          },
        }
        let o2 = {
          name: '删除节点',
          onClick: (e) => {
            this.$confirm('确认删除['+data.name+']吗', '提示', {
              type: "warning",
              closeOnClickModal:false
            }).then(() => {
              let formData = new FormData()
              formData.append('regularId', data.id)
              formData.append('type', data.type)
              this.$api.tevglbookregular.removeRegular(formData).then(res => {
                if(res.code!==0){//删除失败
                  this.$message.error(res.msg);
                  return;
                }else{
                  // 提示
                  this.$message({ message: "操作成功", type: "success" });
                  // 重新加载树
                  this.getSubjectRegularTree(this.$refs.tree.getNode(data.parentId))
                  // 关闭页面
                  this.type = ''
                  // 默认展开节点
                  this.$refs.tree.store.defaultExpandedKeys = [data.parentId]
                  // 清除冗余数据
                  this.clearDataForm()
                }
              })
            })
          },
        }
        let o3 = {
          name: '复制节点',
          onClick: (e) => {
            this.copySubjectId = data.id
          },
        }
        let o4 = {
          name: '粘贴节点',
          onClick: (e) => {
            if (!this.copySubjectId) {
              this.$message({ message: '请先选择要复制的课程节点', type: 'warning' })
              return false
            }
            this.pasteSubjectId = data.id
            if (!this.pasteSubjectId) {
              this.$message({ message: '请先选择要粘贴的课程节点', type: 'warning' })
              return false
            }
            let formData = new FormData()
            formData.append('copySubjectId', this.copySubjectId)
            formData.append('pasteSubjectId', this.pasteSubjectId)
            this.$api.tevglbookregular.paste(formData).then(res => {
              if (res.code == 0) {
                this.$message({ message: res.msg || '操作成功', type: 'success' })
                this.pasteSubjectId = ''
                this.copySubjectId = ''
              } else {
                this.$message({ message: res.msg, type: 'error' })
              }
              // 重新加载树
              this.getSubjectRegularTree(this.$refs.tree.getNode(data.id))
              // 关闭页面
              this.type = ''
              // 默认展开节点
              this.$refs.tree.store.defaultExpandedKeys = [data.id]
            })
          },
        }
        if ('01' == data.type || '02' == data.type) {
          arr.push(o1)
        }
        if ('02' == data.type || '03' == data.type) {
          arr.push(o2)
        }
        if ('01' == data.type) {
          arr.push(o3)
          arr.push(o4)
        }
        let options = {
          menus: arr
        }
        this.createMenu(options)
        // 显示右键菜单
        this.showMenu(event)
      },

      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglbookregular.save(params).then((res) => {
                if (res.code == 0) {
                  // 提示
                  this.$message({ message: '操作成功', type: 'success' })
                  // 关闭页面
                  this.type = ''
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.editDialogVisible = false
                // 默认展开的节点
                if ('-1' == this.dataForm.parentId) {
                  this.dataForm.parentId = this.dataForm.subjectId
                }
                this.getSubjectRegularTree(this.$refs.tree.getNode(this.dataForm.parentId), res.data.regularId)
                this.$refs.tree.store.defaultExpandedKeys = [this.dataForm.parentId]
              })
            })
          }
        })
      },
      clearDataForm() {
        this.dataForm.regularId = ''
        this.dataForm.regularName = ''
        this.dataForm.regularDesc = ''
        this.dataForm.regularSort = ''
        this.dataForm.regularSum = ''
      },
      saveContinue() {
        this.editLoading = true
        const params = Object.assign({}, this.dataForm);
        this.$api.tevglbookregular.save(params).then((res) => {
          this.editLoading = false
          if (res.code == 0) {
            this.$message({ message: '操作成功', type: 'success' })
            // 重置
            this.dataForm.regularName = ''
            this.dataForm.regularDesc = ''
            // 值为-1的时候，表示是在课程节点，新增1级规则
            if (this.dataForm.parentId == '-1') {
              this.getSubjectRegularTree(this.$refs.tree.getNode(this.dataForm.subjectId), res.data.regularId)
              this.$refs.tree.store.defaultExpandedKeys = [this.dataForm.subjectId]
            } else {
              this.getSubjectRegularTree(this.$refs.tree.getNode(this.dataForm.parentId), res.data.regularId)
              this.$refs.tree.store.defaultExpandedKeys = [this.dataForm.parentId]
            }
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        })
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

      changeRegularSum () {

      },

      viewRegular: function (data){
        this.type = data.type
        this.treeNode = data
        if ('01' === data.type) {
          this.dataForm.subjectId = data.id
          let params = {
            subjectId: data.id
          }
          this.$api.tevglbookregular.viewRegular(params).then(res => {
            if (res.code === 0) {
              this.regularList = res.data.regularList
              this.handleHtmlElement(res.data.regularList)
            }
          })
        }
        if ('02' === data.type) {
          this.$api.tevglbookregular.view(data.id).then(res => {
            this.dataForm = Object.assign({}, res.data.tevglBookRegular)
            this.tevglBookSubject = Object.assign({}, res.data.tevglBookSubject)
            this.zongRegularList = res.data.zongRegularList
          })
        }
        if ('03' === data.type) {
          this.$api.tevglbookregular.view(data.id).then(res => {
            this.dataForm = Object.assign({}, res.data.tevglBookRegular)
            this.tevglBookSubject = Object.assign({}, res.data.tevglBookSubject)
            this.zongRegularList = res.data.zongRegularList
          })
        }
      },


      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.regularId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].regularId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglbookregular.doDelete(jj).then(res => {
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
      handleAdd: function (data) {
        this.treeNode = data
        if (data.type == '01') {
          this.dataForm = {}
          this.dialogVisible = true
          this.type = '02'
          this.tevglBookSubject.subjectName = data.name
          this.dataForm.parentId = '-1'
          this.dataForm.subjectId = data.id
        }
        if (data.type == '02') {
          this.dataForm = {}
          this.dialogVisible = true
          this.type = '03'
          this.dataForm.parentId = data.id
        }
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
          this.$refs['dataForm'].resetFields()
        }
        this.dialogVisible = true;
        this.operation = true;
      },
      // 显示修改界面
      handleEdit: function (params) {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglbookregular.view(params.row.regularId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
          }
        });
      },


      filterNode (value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      /***
       * 获取左侧树形数据
       */
      getSubjectRegularTree (node, id) {
        this.$api.tevglbookregular.getSubjectRegularTree().then(res => {
          if (res.code === 0) {
            this.treeData = this.deep(res.data)
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
      deep(arr){
        arr.forEach(item => {
          item.swithToggle = true
          item.ulStyle = true
          item.iconStyleI = true
          if (item.children && item.children.length > 0) {
            this.deep(item.children)
          }
        })
        return arr
      },
      handleHtmlElement(arr){
        // 考核规则
        let regulars = arr
        // 渲染考核表头开始
        // 总规则数，用来合并单元格用
        let totalRegular = 0
        // 表头的第一行(考核指标)
        let oneHead = ""
        //表头的第二行(一级考核规则名称)
        var twoHead = "";
        //表头的第三行(二级考核规则名称)
        var threeHead = "";
        //表头的第四行(二级考核规则分数)
        var fourHead = "";
        //按从左往右的顺序依次保存二级考核规则id
        var regs = [];
        //按从左往右的顺序依次保存二级考核规则最高分数
        var regScores = [];
        //渲染表头的前四行html代码
        if(regulars && regulars.length > 0){
          //从左住右，二级考核规则出现的顺序
          var seq = 0;
          //遍历所有一级考核规则
          for(var i=0; i<regulars.length; i++){
            //获取一级考核规则下的二级考核规则
            var child = regulars[i]["children"];
            //累加二级考核规则数量 如果无二级节点 默认加一操作保证表格顺序不乱
            totalRegular += child.length>0?child.length:1;
            if(child.length>0){
              //组装表头的第二行(一级考核规则名称)html代码
              twoHead += '<th class="text-center" '+(child && child.length > 0? ('colspan="'+ child.length+'"'):'')+'>'+regulars[i].regular_name+"("+regulars[i].regular_sum+")"+'</th>';
              //遍历一级考核下的二级考核规则
              for(var j=0; j<child.length; j++){
                //组装表头的第三行(二级考核规则名称)
                threeHead += '<th class="top">'+child[j].regular_name+'</th>';
                //组装表头的第四行(二级考核规则分数)
                fourHead += '<th>('+child[j].regular_sum+'分)</th>';
                //按从左往右的顺序依次保存二级考核规则id
                regs[seq] = child[j].regular_id;
                regScores[seq++] = child[j].regular_sum;
              }
            }else{
              twoHead += '<th class="text-center">'+regulars[i].regular_name+"("+regulars[i].regular_sum+")"+'</th>'
              threeHead += '<th class="text-center">无</th>';
              fourHead += '<th class="text-center">无</th>';
            }
          }
          //组装表头的第一行(考核指标)
          oneHead += '<th class="middle text-center" '+(totalRegular > 0? ('colspan="'+ totalRegular+'"'):'')+'>考核指标</th>';
        }else{
          oneHead += "<th class='middle text-center' colspan='13'>考核指标</th>";
          twoHead += "<th class='text-center' colspan='13'>无</th>";
          threeHead += "<th class='text-center' colspan='13'>无</th>";
          fourHead += "<th class='text-center' colspan='13'>无</th>";
        }
        //组装表头第一行(共四行)
        var uhtml = "<thead><tr>";
        uhtml += '<th rowspan="4" class="middle text-center">序号</th>';
        uhtml += '<th rowspan="4" class="middle text-center">考核人</th>';
        uhtml += oneHead;
        uhtml += '<th rowspan="4" class="middle text-center">最终得分</th>';
        uhtml += '</tr>';
        //组装表头第二行
        uhtml += '<tr>';
        uhtml += twoHead;
        uhtml += '</tr>';
        //组装表头第三行
        uhtml += '<tr class="three-tr">';
        uhtml += threeHead;
        uhtml += '</tr>';
        //组装表头第四行
        uhtml += '<tr>';
        uhtml += fourHead;
        uhtml += '</tr></thead><tbody>';
        uhtml += "</tbody>";
        //成绩录入表单html组装完成，渲染到表单上
        let myTable = document.getElementById('myTable')
        if (myTable) {
          myTable.innerHTML = uhtml
        }
      },

    },
    mounted() {
      this.getSubjectRegularTree()
      document.addEventListener("click", this.hideMenu);
    }
  }
</script>

<style >

  .el-input-number.is-controls-right .el-input__inner {
    text-align: left;
  }

  .regular-form {
    margin-top: 6px;
    padding: 10px 5px;
  }

  .table-bordered {
    border: 1px solid #ddd
  }
  .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    background-color: transparent;
    border-spacing: 0;
    border-collapse: collapse;
  }
  .table th {
    box-sizing: border-box;
  }
  .table>caption+thead>tr:first-child>td, .table>caption+thead>tr:first-child>th, .table>colgroup+thead>tr:first-child>td, .table>colgroup+thead>tr:first-child>th, .table>thead:first-child>tr:first-child>td, .table>thead:first-child>tr:first-child>th {
    border-top: 0;
  }
  .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
    border-bottom-width: 2px;
  }
  .table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
  }
  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
  }
  .table td, .table th {
    vertical-align: middle;
  }
  .fixed-table-body thead th .th-inner, .table td, .table th {
    box-sizing: border-box;
  }
  .text-center {
    text-align: center;
  }

 .th {
   width: 150px;
   text-align: center;
   vertical-align: middle!important;
 }
  .cb-table {
    border: 1px solid #ddd;
    margin-top: 10px;
  }

</style>
