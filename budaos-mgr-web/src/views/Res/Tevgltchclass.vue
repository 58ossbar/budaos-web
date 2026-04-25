<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
	        <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>所属院校</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <!--<cb-select :parentVue="this._self" url="/api/tch/tevgltchteacher/query" placeholder="请选择班级助教"
                           :filters="filters" name="teachingAssistant" prop='{"id":"teacherId", "value":"teacherName"}'
                           clearable :change="findPage"
                 ></cb-select>-->
                <cb-tree :parentVue="this._self" url='/api/sys/role/orgTree' placeholder="请选择所属院校" :change="findPage" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :filters="filters"></cb-tree>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>职业路径</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" :filters="filters" :change="findPage" placeholder="请选择所属职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>班级名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.className" placeholder="班级名称" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
	        </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级助教</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-autocomplete :parentVue="this._self" name="teachingAssistant" value="teachingAssistant" :filters="filters"
                                     url="/api/tch/tevgltchteacher/query" prop='{"id":"teacherId", "value":"teacherName"}'
                                     :change="findPage" placeholder="请选择班级助教"></cb-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="班级状态" name="classState" dict="class_state" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级类型</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="班级类型" name="type" dict="class_type" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                  </el-form-item>
                </el-col>

                <!--<el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>时长</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input  v-model="filters.classTime" placeholder="时长" clearable @clear="findPage"></el-input>
                    </el-form-item>
                  </el-col>-->


	            <!--<el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>开班时间</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.acceptTime" placeholder="开班时间" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>

	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>开班人数</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.acceptSum" placeholder="开班人数" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>备注</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.remark" placeholder="备注" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>-->

	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="tch:tevgltchclass:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="tch:tevgltchclass:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="tch:tevgltchclass:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSave">
      <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataTevglTchClass"
               :size="size" style="margin-top: 10px">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float:left;">
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
              </el-form-item>
              <el-form-item label="班级名称" prop="className">
                <el-input v-model="dataForm.className" auto-complete="off" placeholder="请输入班级名称" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="班级教师" prop="teacherId">
                <el-select v-model="dataForm.teacherId" class="widthAll" placeholder="请选择班级教师">
                  <el-option
                    v-for="item in teacherList"
                    :key="item.traineeId"
                    :label="item.teacherName"
                    :value="item.traineeId">
                    <div style="float: left"><el-image style="width: 30px; height: 30px;border-radius: 50%;" :src="item.teacherPic" fit="fill"></el-image></div>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级助教" prop="teachingAssistant">
                <el-select v-model="dataForm.teachingAssistant" class="widthAll" placeholder="请选择班级助教">
                  <el-option
                    v-for="item in teacherList"
                    :key="item.teacherId + 'ta'"
                    :label="item.teacherName"
                    :value="item.traineeId">
                    <div style="float: left"><el-image style="width: 30px; height: 30px;border-radius: 50%;" :src="item.teacherPic" fit="fill"></el-image></div>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级状态" prop="classState">
                <cb-dict placeholder="班级状态" name="classState" dict="class_state" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="班级类型" prop="classTime">
                <cb-dict :parentVue="this._self" placeholder="班级类型" name="type" dict="class_type" type="select" :dataForm="dataForm" clearable></cb-dict>
              </el-form-item>
            </div>
            <div style="float:left; width: 49%;">
              <el-form-item label="职业路径" prop="majorId">
                <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" :dataForm="dataForm" placeholder="请选择职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
              </el-form-item>
              <el-form-item v-if="dataForm.type" label="报名开始时间" prop="registrationStartTime">
                <el-date-picker v-model="dataForm.registrationStartTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;" placeholder=""></el-date-picker>
              </el-form-item>
              <el-form-item v-if="dataForm.type" label="预计开班时间" prop="expectTime">
                <el-date-picker v-model="dataForm.expectTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;" placeholder="预计开班时间 / 报名结束时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="实际开班时间" prop="acceptTime">
                <el-date-picker v-model="dataForm.acceptTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="开班人数" prop="acceptSum">
                <el-input-number v-model="dataForm.acceptSum" class="widthAll" controls-position="right" :min="1" :max="99999"></el-input-number>
              </el-form-item>
              <el-form-item label="班级编号" prop="classNo">
                <el-input v-model="dataForm.classNo" auto-complete="off" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="时长" prop="classTime">
                <el-input v-model="dataForm.classTime" auto-complete="off" maxlength="30"></el-input>
              </el-form-item>
            </div>
            <div style="float: left; width:98%;">
              <el-form-item label="班级封面" prop="classPic">
                <div style="display: flex; width: 100%;">
                  <div v-for="itemLogo in classPicList" v-bind:key="itemLogo.dictId" class="subjectLogo" style="margin: 0 10px;cursor: pointer;">
                    <img class="cb-class-img" @click="imgClick(itemLogo.dictId)" :id="itemLogo.dictId" :url="itemLogo.shortUrl"  :iid="itemLogo.dictCode"  :src="itemLogo.dictUrl" />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="自定义封面" prop="teacherPic">
                <div style="float: left">
                  <cb-upload type="13" name="classImg" :dataForm="dataForm" placeholder="上传封面图" title="点击上传班级封面图"></cb-upload>
                </div>
              </el-form-item>
            </div>
            <div class="floating-all temp-remark">
              <el-form-item label="备注" prop="remark">
                <cb-editor ref="remark" id="remark" name="remark" :parentVue="this._self" :dataForm="dataForm"></cb-editor>
              </el-form-item>
            </div>
          </el-collapse-item>
          <!--更多信息 begin -->
          <!--
          <el-collapse-item title="" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>

              <el-form-item label="预计开班时间" prop="expectTime">
                <el-input v-model="dataForm.expectTime" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="当前报名人数" prop="curSum">
                <el-input v-model="dataForm.curSum" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="计划开班人数" prop="expectSum">
                <el-input v-model="dataForm.expectSum" auto-complete="off"></el-input>
              </el-form-item>
          </el-collapse-item>
          -->
          <!--更多信息 end -->
        </el-collapse>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "../../utils/global";
import CbSelect from "../../components/cbselect/index";
import {getYearMonthDay} from "@/utils/datetime"

export default {
    components:{
      CbSelect,
      CbButton
    },
    data() {
      return {
        teacherList: [],
        teachingAssistantList: [],
        classPicList:[],
        activeName:"1", // 默认展开的折叠面板
        teacherPostList : [], // 职位

        dataTevglTchClass: {
          majorId: [{ required: true, message: "职业路径不能为空", trigger: "blur" }],
          orgId: [{ required: true, message: "所属院校不能为空", trigger: "change" }],
          className: [{ required: true, message: "班级名称不能为空", trigger: "blur" }],
          teacherId: [{ required: true, message: "班级教师不能为空", trigger: "blur" }],
          teachingAssistant: [{ required: true, message: "班级助教不能为空", trigger: "blur" }],
          classState: [{ required: true, message: "班级状态不能为空", trigger: "blur" }],
          acceptSum: [{ required: true, message: "开班人数不能为空", trigger: "blur" }],
          registrationStartTime: [{ required: true, message: "报名开始时间不能为空", trigger: "blur" }],
          acceptTime: [{ required: true, message: "实际开班时间不能为空", trigger: "blur" }],
          expectTime: [{ required: true, message: "预计开班时间不能为空", trigger: "blur" }],
          /*classTime: [{ required: true, message: "时长不能为空", trigger: "blur" }],
          classNo: [{ required: true, message: "班级编号不能为空", trigger: "blur" }],
          classPic: [{ required: true, message: "班级缩略图不能为空", trigger: "blur" }],
          yprice: [{ required: true, message: "原价格不能为空", trigger: "blur" }],
          yhPrice: [{ required: true, message: "优惠价格不能为空", trigger: "blur" }],
          tgPrice: [{ required: true, message: "团购价格不能为空", trigger: "blur" }],


          curSum: [{ required: true, message: "当前报名人数不能为空", trigger: "blur" }],
          expectSum: [{ required: true, message: "计划开班人数不能为空", trigger: "blur" }],
          remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],*/
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          classId: '', //班级标识ID
          majorId: '', //专业标识ID
          orgId: '', //机构ID
          classNo: '', //班级编号
          className: '', //班级名称
          classPic: '', //班级缩略图
          yprice: '', //原价格
          yhPrice: '', //优惠价格
          tgPrice: '', //团购价格
          classTime: '', //时长
          classState: '1', //班级状态：开放、授课、完成
          registrationStartTime: '', // 报名开始时间
          expectTime: '', //预计开班时间
          acceptTime: '', //实际开班时间
          curSum: '', //当前报名人数
          expectSum: '', //计划开班人数
          acceptSum: '', //实际开班人数
          remark: '', //备注
          teachingAssistant: '', //助教
          teacherId: '',
          type: '',
          classImg: ''
        },
        columns: [
          {prop:"classPic", label:"班级封面", minWidth:70, dataType:'image', },
          {prop:"className", label:"班级名称", minWidth:70},
          {prop:"majorName", label:"职业路径", minWidth:70},
          {prop:"orgId", label:"所属院校", minWidth:70},
          {prop:"teacherName", label:"班级教师", minWidth:70},
          {prop:"teachingAssistantName", label:"班级助教", minWidth:70},
          {prop:"acceptTime", label:"开班时间", minWidth:70},
          {prop:"acceptSum", label:"开班人数", minWidth:70},
          {prop:"classState", label:"班级状态", minWidth:70, dataType:'tag', type:'success', id:'classId', mapper:'[{"key":"爆满", "value":"danger"},{"key":"授课", "value":"warning"},{"key":"已完成", "value":""}]'},
          {prop:"type", label:"班级类型", minWidth:100},
          /*{prop:"classNo", label:"班级编号", minWidth:70},
          {prop:"yprice", label:"原价格", minWidth:70},
          {prop:"yhPrice", label:"优惠价格", minWidth:70},
          {prop:"tgPrice", label:"团购价格", minWidth:70},
          {prop:"createUserId", label:"创建人", minWidth:70},
          {prop:"createTime", label:"创建时间", minWidth:70},
          {prop:"updateUserId", label:"最近修改人", minWidth:70},
          {prop:"updateTime", label:"最近修改时间", minWidth:70},
          {prop:"classTime", label:"时长", minWidth:70},
          {prop:"expectTime", label:"预计开班时间", minWidth:70},
          {prop:"curSum", label:"当前报名人数", minWidth:70},
          {prop:"expectSum", label:"计划开班人数", minWidth:70},
          {prop:"remark", label:"备注", minWidth:70},*/
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "tch:tevgltchclass:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "tch:tevgltchclass:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
      }
    },
    mounted() {
      this.getClassPic()
      this.queryTeacherList()
      // this.getTeachingAssistant()
    },
    methods: {
      queryTeacherList() {
        const params = {
          hasTraineeId: 'Y'
        }
        this.$api.tevgltchclassroom.queryTeacherList(params).then(res => {
          res.data.forEach(item => {
            item.teacherPic = baseUrl + item.teacherPic
          })
          this.teacherList = res.data
        })
      },
      // 图片点击
      imgClick: function (data) {
        if (!$('#' + data).hasClass('subjectLogoSelectedImg')) {
          $('.subjectLogoSelectedImgI').remove()
          $('.subjectLogoSelectedImg').removeClass('subjectLogoSelectedImg')
          $('#' + data).addClass('subjectLogoSelectedImg')
          let kk = '<i class="fa fa-check-circle subjectLogoSelectedImgI" aria-hidden="true"></i>'
          $('#' + data).after($(kk))
          this.dataForm.classPic = $('#' + data).attr("url")
        } else {
          this.dataForm.classPic = $('#' + data).attr("url")
        }
      },

      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        } else {
          this.pageRequest.pageNum = 1
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevgltchclass.findPage(jj).then((res) => {
          if (res.code == 0) {
            if (res.data.list.length > 0){
              res.data.list.forEach(a => {
                a.classPic = baseUrl + a.classPic
              })
            }
          }
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.classId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].classId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevgltchclass.doDelete(jj).then(res => {
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
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = true;
        setTimeout(() => {
          this.imgClick(this.classPicList[0].dictId)
        }, 300);
        this.dataForm.acceptTime = getYearMonthDay()
        if (this.$refs.remark) {
          this.$refs.remark.setContent('')
        }
		    // 清空富文本
		    if (tinyMCE.editors['remark']) {
          tinyMCE.editors['remark'].setContent('')
        }

      },
      // 显示修改界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevgltchclass.view(params.row.classId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.classPicList.forEach(logo => {
              if(logo.shortUrl == res.data.classPic){
                this.dataForm.classPic = res.data.classPic
                setTimeout(() => {
                  this.imgClick(logo.dictId);
                }, 300);
              }
            })
            // 如果实际开班时间为空，则默认为当天
            if (!this.dataForm.acceptTime) {
              this.dataForm.acceptTime = getYearMonthDay()
            }
            setTimeout(() => {
              this.$refs.remark.setContent(this.dataForm.remark)
            }, 500);
          }
        });
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              // 图片若使用封装的控件，处理一下
              if (this.dataForm.classPic){
                let arr = this.dataForm.classPic.split("/");
                if (arr.length > 0){
                  this.dataForm.classPic = arr[arr.length-1];
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tevgltchclass.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      //this.$refs['dataForm'].resetFields()
                      // 重置数据，undefined会导致element-ui表单校验不通过
                      const pic = this.dataForm.classPic
                      this.dataForm = {
                        classId: '', //班级标识ID
                        majorId: params.majorId, //专业标识ID
                        orgId: params.orgId, //机构ID
                        classNo: '', //班级编号
                        className: '', //班级名称
                        classPic: pic, //班级缩略图
                        yprice: '', //原价格
                        yhPrice: '', //优惠价格
                        tgPrice: '', //团购价格
                        classTime: '', //时长
                        classState: '1', //班级状态：开放、授课、完成
                        registrationStartTime: '', // 报名开始时间
                        expectTime: '', //预计开班时间
                        acceptTime: '', //实际开班时间
                        curSum: '', //当前报名人数
                        expectSum: '', //计划开班人数
                        acceptSum: '', //实际开班人数
                        remark: '', //备注
                        teachingAssistant: '', //助教
                        teacherId: '',
                        type: this.dataForm.type,
                        classImg: ''
                      }
                      if (this.$refs.remark) {
                        this.$refs.remark.setContent('')
                      }
                    }
                    //this.clearFormData()
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.editDialogVisible = false
                  this.findPage()
                })
            })
          }
        })
      },
      dialogCloseForSave:function(){
        this.clearFormData()
        this.$refs.remark.setContent('')
      },
      clearFormData:function (){
        this.dataForm = {
          classId: '', //班级标识ID
            majorId: '', //专业标识ID
            orgId: '', //机构ID
            classNo: '', //班级编号
            className: '', //班级名称
            classPic: '', //班级缩略图
            yprice: '', //原价格
            yhPrice: '', //优惠价格
            tgPrice: '', //团购价格
            classTime: '', //时长
            classState: '1', //班级状态：开放、授课、完成
            registrationStartTime: '', // 报名开始时间
            expectTime: '', //预计开班时间
            acceptTime: '', //实际开班时间
            curSum: '', //当前报名人数
            expectSum: '', //计划开班人数
            acceptSum: '', //实际开班人数
            remark: '', //备注
            teachingAssistant: '', //助教
            teacherId: '',
            type: '',
            classImg: ''
        }
      },
      getClassPic:function () {
        this.$api.tevgltchclass.getClassPic().then((res) => {
          if (res.code == 0){
            this.classPicList = res.data;
            this.classPicList.map(logo => {
              //logo.shortUrl = logo.dictUrl.substring(logo.dictUrl.lastIndexOf("/") + 1)
              logo.shortUrl = logo.dictUrl
              logo.dictUrl = baseUrl + logo.dictUrl
            })
          }
        })
      },

      getTeachingAssistant:function () {
        this.$api.tevgltchclass.getTeachingAssistant().then((res) => {
          if (res.code === 0) {
            this.teachingAssistantList = res.data
          }
        })
      }

    }
  }
</script>

<style scoped>
  .subjectLogoSelectedImg {
    border: 4px solid #28a745;
    position: relative;
  }
  .cb-class-img {
    width: 130px;
  }
</style>
