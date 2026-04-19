<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header
        class="box_shadows bgcolor scrollRightYDictMenu"
        style="height: auto"
      >
        <!--工具栏-->
        <el-form
          class="queryForm"
          label-width="100px"
          ref="queryForm"
          :inline="true"
          :model="filters"
          :size="size"
        >
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>资讯标题</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth">
                <el-input
                  v-model="filters.newTitle"
                  placeholder="资讯标题"
                  clearable
                  @clear="clearInputValueForQueryNewTitle"
                  @keyup.enter.native="keyupEnterForQueryNewTitle"
                  @keyup.delete.native="keyupDeleteForQueryNewTitle"
                  @keyup.space.native="keyupSpaceForQueryNewTitle"
                ></el-input>
              </el-form-item>
            </el-col>

             <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>资讯分类</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth">
                <cb-dict
                  placeholder="请选择分类"
                  name="officialLinkType"
                  dict="official_link_type"
                  type="select"
                  :filters="filters"
                  emptyLabel="全部"
                  :change="findPage"
                  @findData="getOfficialLinkTypeData"></cb-dict>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>状态</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth">
                <cb-dict
                  placeholder="请选择状态"
                  name="status"
                  dict="newsStatus"
                  type="select"
                  :filters="filters"
                  emptyLabel="全部"
                  :change="findPage"
                ></cb-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button
                icon="fa fa-search"
                :label="$t('action.search')"
                perms="official:tevglsitenews:query"
                type="primary"
                @click="findPage(null)"
              />
              <cb-button
                icon="fa fa-plus"
                :label="$t('action.add')"
                perms="official:tevglsitenews:add"
                type="primary"
                @click="handleAdd"
              />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main
        class="box_shadows bgcolor scrollRightYDictMenu tableDict marginBottom"
      >
        <!--表格内容栏-->
        <cb-tables
          :parentVue="this._self"
          permsBatchDelete="site:tevglsitenews:remove"
          :tableData="pageResult"
          :columns="columns"
          :btnColumns="btnColumns"
          :otherBatchBtnColumns="otherBatchBtnColumns"
        >
        </cb-tables>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable";
import CbButton from "@/views/Core/CbButton";
import {baseUrl} from "@/utils/global";

export default {
  components: {
    CbTable,
    CbButton,
  },

  data() {
    return {
      // TODO 表单验证
      size: "small",
      filters: {},
      isOpen: true, // 是否开启点击表格行也选中
      tagType:['','success','warning','danger','info'],
      columns: [
        {
          prop: "newsLogo",
          label: "资讯logo",
          minWidth: 80,
          dataType: "image",
          type:'2',
        },
        {
          prop: "newTitle",
          label: "资讯标题",
          minWidth: 80,
          //dataType: "link",
          callback: "linkClick",
        },
        {
          prop:"officialLinkType",
          label:"所属分类",
          minWidth:60,
          dataType:'tag',
          type:'',//'success',
          id:'newsid',
          mapper:''
          // mapper:'[{"key":"待审核", "value":"danger"},{"key":"未通过", "value":"warning"}]'
        },
        { prop: "author", label: "作者", minWidth: 80 },
        {
          prop: "status",
          label: "状态",
          minWidth: 80,
          dataType: "switch",
          callback: "switchForNoone",
        },
      ],
      btnColumns: [
        {
          icon: "fa fa-edit",
          label: "修改",
          perms: "official:tevglsitenews:edit",
          callback: "handleEdit",
        },
        {
          icon: "fa fa-trash",
          label: "删除",
          perms: "official:tevglsitenews:delete",
          callback: "handleDelete",
        },
      ],
      otherBatchBtnColumns: [
        /*{
          icon: "fa fa-check-square-o",
          label: "批量发布",
          perms: "site:tevglsitenews:check",
          callback: "handleCheck",
        },*/
      ],
      pageResult: {},
    };
  },

  watch: {},

  methods: {
    linkClick(params) {
      // 点击标题进行预览   params.row.newsid
    },
    getOfficialLinkTypeData(data){
      console.log('data', data)
      if (data && data.length > 0) {
        let str = '[';
        let j = 0;
        data.forEach((ele,index) => {
          if(j>this.tagType.length){
            j=0;
          }
          str = str + '{"key":"' +ele.dictValue+'", "value":"'+this.tagType[j]+'"}';
          if (index < (data.length - 1)) {
            str = str + ','
          }
          j++;
        });
        str= str + ']';
        console.log('str', str)
        this.columns[2].mapper = str;
        console.log('this.columns', this.columns)
      }
    },
    // 表格组件中是否头条switch开关
    switchForNoone(data) {
      const formData = new FormData()
      formData.append('newsid', data.row.newsid)
      if (data.e == true) {
        formData.append('status', '2')
      } else {
        formData.append('status', '1')
      }
      this.$api.wxMaterial.release(formData).then((res) => {
        if (res.code == 0){
          this.$message({ message: "操作成功", type: "success" });
          this.findPage()
        } else {
          this.$message({ message: "操作失败", type: "error" });
        }
      });
    },
    // 表格组件中的批量发布
    handleCheck(data) {
      let arr = [];
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].newsid);
      }
      this.checkComm(arr, data);
    },
    //执行发布
    checkComm: function (jj, darass) {
      this.$confirm("确认发布选中记录吗？", "提示", {
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          // this.$api.tevglsitenews.doDelete(jj).then(res => {
          //   if(res.code!==0){//删除失败
          //     this.$message.error(res.msg);
          //     return;
          //   }else{
          //     this.$message({ message: "操作成功", type: "success" });
          //     this.findPage(null);
          //   }
          // }).then(darass!=null?darass.callback:'').catch(res => {
          //   this.$message.error("删除失败，请联系管理员!");
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
    },
    // TODO 查询条件之资讯标题
    clearInputValueForQueryNewTitle() {
      this.pageRequest.pageNum = 1;
      this.findPage();
    },
    keyupEnterForQueryNewTitle() {
      this.pageRequest.pageNum = 1;
      this.findPage();
    },
    keyupDeleteForQueryNewTitle(e) {
      if (e.target.value.length == 0) {
        this.pageRequest.pageNum = 1;
        this.findPage();
      }
    },
    keyupSpaceForQueryNewTitle() {},
    // 获取分页数据
    findPage: function (data) {
      if (data !== null && data != undefined) {
        this.pageRequest = data.pageRequest;
      }
      let jj = {};
      jj = Object.assign({}, this.filters);
      jj.pageNum = this.pageRequest.pageNum;
      jj.pageSize = this.pageRequest.PageSize;
      jj.sidx = "update_time";
      jj.order = "desc";
      this.$api.wxMaterial
        .queryForOfficial(jj)
        .then((res) => {
          if (res.code == 0) {
            if (res.data.list.length > 0) {
              res.data.list.forEach((a) => {
                // 图片路径
                if (a.newsLogo && (a.newsLogo).indexOf('://') < 0) {
                  a.newsLogo = baseUrl + a.newsLogo;
                }
                // 切换值，便于表格组件switch开关
                if (a.status == "2") {
                  a.status = true;
                } else if (a.status == "1") {
                  a.status = false;
                }
              });
            }
          }
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
    },
    // 表格组件中的单条删除
    handleDelete(data) {
      let arr = [];
      arr.push(data.row.newsid);
      this.delete(arr, data);
    },
    // 表格组件中的批量删除
    handleBatchDelete(data) {
      let arr = [];
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].newsid);
      }
      this.delete(arr, data);
    },
    //执行删除
    delete: function (jj, darass) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          this.$api.wxMaterial
            .doDeleteNews(jj)
            .then((res) => {
              if (res.code !== 0) {
                //删除失败
                this.$message.error(res.msg);
                return;
              } else {
                this.$message({ message: "操作成功", type: "success" });
                this.findPage(null);
              }
            })
            .then(darass != null ? darass.callback : "")
            .catch((res) => {
              this.$message.error("删除失败，请联系管理员!");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 显示新增界面
    handleAdd: function () {
      this.$router.push("/modules/wechat/newsedit");
    },
    // 显示修改界面
    handleEdit: function (params) {
      let newsId = params.row.newsid;
      this.$router.push({
        path: "/modules/wechat/newsedit",
        query: {
          newsId: newsId,
        },
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>

