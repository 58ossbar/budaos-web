<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="200px" class="box_shadows bgcolor LeftPadding marginBottom">
        <cb-tree-panel :parent-vue="_self" url="/api/book/tevglbookmajor/queryForTree" root-node="职业路径" name="majorTree" prop="{&quot;id&quot;: &quot;majorId&quot;, &quot;name&quot;: &quot;majorName&quot;}" :node-click="changeMajor" />
      </el-aside>
      <el-container>
        <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form ref="queryForm" class="queryForm" label-width="100px" :inline="true" :model="filters" :size="size">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>课堂状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-select
                      v-model="filters.classroomState"
                      style="width:100%;"
                      placeholder="请选择课堂状态"
                      @change="changeClassroomState"
                    >
                      <el-option
                        v-for="item in classroomStateList"
                        :key="item.dictId"
                        :value="item.dictCode"
                        :label="item.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>课堂名称</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.name" placeholder="课堂名称" clearable @clear="findPage" />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>所属教师</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-select v-model="filters.teacherId" style="width:100%;" placeholder="请选择" clearable @change="changeTeacher" @clear="findPage">
                      <el-option
                        v-for="item in teacherList"
                        :key="item.teacherId"
                        :label="item.teacherName"
                        :value="item.teacherId">
                        <div style="float: left"><el-image style="width: 30px; height: 30px;border-radius: 50%;" :src="item.teacherPic" fit="fill"></el-image></div>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>教师手机</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.mobile" placeholder="教师手机" clearable @clear="findPage" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>邀请码</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.invitationCode" placeholder="邀请码" clearable @clear="findPage" />
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')" perms="tch:tevgltchclassroom:query" type="primary" @click="findPage(null)" />
                <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="tch:tevgltchclassroom:add" type="primary" @click="handleAdd" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-tables
            :parent-vue="_self"
            perms-batch-delete="tch:tevgltchclassroom:remove"
            :table-data="pageResult"
            :columns="columns"
            :btn-columns="btnColumns"
          />
        </el-main>
      </el-container>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="100px"
        :rules="dataTevglTchClassroom"
        :size="size"
        style="margin-top: 10px"
      >
        <div class="floating-half">
          <el-form-item label="课堂名称" prop="name">
            <el-input v-model="dataForm.name" auto-complete="off" maxlength="100" />
          </el-form-item>
          <el-form-item label="职业路径" prop="majorId">
            <el-select
              id="majorId"
              v-model="dataForm.majorId"
              style="width:100%;"
              placeholder="请选择职业路径"
              disabled
              @change="changeMajor"
            >
              <el-option
                v-for="item in majorList"
                :key="item.majorId"
                :label="item.majorName"
                :value="item.majorId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程体系" prop="subjectId">
            <el-select
              id="subjectId"
              v-model="dataForm.subjectId"
              style="font-size: 14px;width:100%;"
              placeholder="请选择课程体系"
              disabled
              @change="changeSubject"
            >
              <el-option
                v-for="item in subjectList"
                :key="item.subjectId"
                :label="item.subjectName"
                :value="item.subjectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用教学包" prop="teacherId">
            <el-select
              id="pkg"
              v-model="dataForm.pkgId"
              style="font-size: 14px;width:100%"
              placeholder="请选择教学包"
              disabled
            >
              <el-option
                v-for="item in pkgList"
                :key="item.pkgId"
                :label="item.pkgName"
                :value="item.pkgId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上课班级" prop="classId">
            <el-select
              id="classId"
              v-model="dataForm.classId"
              style="width:100%;"
              disabled
              placeholder="请选择上课班级"
            >
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学习人数" prop="state">
            <el-input v-model="dataForm.studyNum" auto-complete="off" disabled />
          </el-form-item>
        </div>
        <div class="floating-half textAlign">
          <el-form-item label="课堂封面" prop="pic">
            <cb-upload type="14" name="pic" :data-form="dataForm" placeholder="上传课堂封面" />
          </el-form-item>
          <el-form-item label="是否审核" prop="invitationCode" title="加入此课堂，是否需要课堂创建者审核">
            <el-switch v-model="dataForm.isCheck" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
          </el-form-item>
          <el-form-item label="公开课" prop="state">
            <el-switch v-model="dataForm.isPublic" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
          </el-form-item>
          <el-form-item label="直播课" prop="state">
            <el-switch v-model="dataForm.ifLiveLesson" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
          </el-form-item>
        </div>
        <div class="floating-all">
          <el-form-item v-if="dataForm.ifLiveLesson" label="直播地址" prop="intro">
            <el-input v-model="dataForm.linkUrl" auto-complete="off" />
          </el-form-item>
          <el-form-item label="课堂简介" prop="intro">
            <el-input v-model="dataForm.intro" auto-complete="off" type="textarea" :rows="3" maxlength="500" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" :loading="editLoading" @click.native="submitForm('saveContinue')">{{ $t('action.saveContinue') }}</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>
    <!-- 移交页面 -->
    <el-dialog v-dialogDrag :title="dataFormTurnOver.title" width="40%" :visible.sync="dialogVisibleForTurnOver" :close-on-click-modal="false">
      <el-form ref="formTurnOver" class="textAlign" label-width="120px" :rules="dataRuleTurnOver" :inline="true" :model="dataFormTurnOver" :size="size" style="margin-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item class="dictInputQueryLabelWidth">
              <span style="color:#F56C6C;">注意：当前操作为敏感操作</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="请选择教师" prop="teacherId" class="dictInputQueryLabelWidth">
              <el-select v-model="dataFormTurnOver.teacherId" placeholder="请选择移交给哪位教师">
                <el-option
                  v-for="item in teacherList"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId">
                  <div style="float: left"><el-image style="width: 30px; height: 30px;border-radius: 50%;" :src="item.teacherPic" fit="fill"></el-image></div>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleForTurnOver = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" type="primary" :loading="editLoadingTurnOver" @click.native="saveTurnOver">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>
    <!-- 设置学员在课堂结束后，是否还能进入 -->
    <change-access-state ref="changeAccessState" />
  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'
import {baseUrl} from '../../utils/global'
import ChangeAccessState from './classroom/change-access-state.vue'

export default {
  components: {
    CbButton,
    ChangeAccessState
  },
  data() {
    return {
      dataFormTurnOver: {
        ctId: '',
        name: '',
        teacherName: '',
        teacherId: ''
      },
      dataRuleTurnOver: {
        teacherId: [{ required: true, message: '教师不能为空', trigger: 'blur' }]
      },
      dialogVisibleForTurnOver: false,
      editLoadingTurnOver: false,
      teacherList: [],
      classroomStateList: [],
      majorList: [],
      subjectList: [],
      pkgList: [],
      classList: [],
      dataTevglTchClassroom: {
        majorId: [{ required: true, message: '职业路径不能为空', trigger: 'blur' }],
        classId: [{ required: true, message: '上课班级不能为空', trigger: 'blur' }],
        subjectId: [{ required: true, message: '课程体系不能为空', trigger: 'blur' }],
        pic: [{ required: true, message: '课堂封面图不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '课堂名称不能为空', trigger: 'blur' }]
      },
      size: 'small',
      filters: {
        majorId: '',
        teacherName: '',
        classroomState: '2',
        mobile: ''
      },
      dataForm: {
        ctId: '', // 主键ID
        majorId: '', // 职业课程路径ID
        teacherId: '', // 教师ID
        classId: '', // 班级ID(上课班级)
        subjectId: '', // 课程ID(指定教材)
        isPublic: '', // 是否发布(Y发布)
        pic: '', // 课堂封面图
        invitationCode: '', // 邀请码
        name: '', // 课堂名称
        intro: '', // 简介
        studyNum: '' // 学习人数
      },
      columns: [
        { prop: 'pic', label: '课堂封面', minWidth: 80, dataType: 'image', type: '2', imgWidth: '70px', imgHeight: '30px' },
        { prop: 'name', label: '课堂名称', minWidth: 120 },
        { prop: 'invitation_code', label: '邀请码', minWidth: 60 },
        { prop: 'teacher_name', label: '教师名称', minWidth: 70 },
        { prop: 'mobile', label: '联系方式', minWidth: 70 },
        //{ prop: 'class_name', label: '班级名称', minWidth: 100 },
        //{ prop: 'subjectId', label: '教材名称', minWidth: 70 },
        { prop: 'study_num', label: '学习人数', minWidth: 70 },
        { prop: 'classroomStateName', label: '课堂状态', minWidth: 70 },
        { prop: 'create_time', label: '创建时间', minWidth: 70 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'tch:tevgltchclassroom:edit', callback: 'handleEdit' },
        { icon: 'fa fa-heartbeat', label: '结束', perms: 'tch:tevgltchclassroom:end', callback: 'handleEnd' },
        { icon: 'fa fa-handshake-o', label: '移交', perms: 'tch:tevgltchclassroom:turnover', callback: 'turnOver' },
        { icon: 'fa fa-superpowers', label: '设置', perms: 'tch:tevgltchclassroom:set', callback: 'handleAccessState' }
      ],
      pageResult: {},
      value: '',
      dialogVisible: false,
      operation: false, // true:新增, false:修改
      editDialogVisible: false, // 新增修改界面是否显示
      editLoading: false
    }
  },
  created() {
  },
  mounted() {
    this.listClassroomState()
    this.queryTeacherList()
  },
  methods: {
    handleAccessState(params) {
      const item = params.row
      if (item.classroom_state !== '3') {
        this.$message.warning('该功能，只对已结束的课堂开放！')
        return false
      }
      this.$refs.changeAccessState.handleAdd(item)
    },
    queryTeacherList() {
      this.$api.tevgltchclassroom.queryTeacherList().then(res => {
        res.data.forEach(item => {
          item.teacherPic = baseUrl + item.teacherPic
        })
        this.teacherList = res.data
      })
    },
    changeTeacher() {
      this.pageRequest.pageNum = 1
      this.findPage()
    },
    listClassroomState() {
      this.$api.tevgltchclassroom.listClassroomState().then(res => {
        this.classroomStateList.push({dictId: '1a213a', dictCode: '', dictValue: '全部'})
        res.data.forEach(item => {
          this.classroomStateList.push(item)
        })
      })
    },
    changeClassroomState() {
      this.findPage()
    },
    // 左侧职业树节点切换事件
    changeMajor: function(data) {
      this.filters.majorId = data.majorId
      this.findPage()
    },
    changeSubject() {},
    showMajorList() {
      this.$api.tevgltchclassroom.getMajorList().then(res => {
        this.majorList = res.data
      })
    },
    showSubjectList () {
      let params = {
        majorId: this.dataForm.majorId
      }
      this.$api.tevgltchclassroom.listSelectSubject(params).then(res => {
        if (res.code === 0) {
          this.subjectList = res.data
        }
      })
    },
    showPkgList () {
      let params = {
        ctId: this.dataForm.ctId,
        majorId: this.dataForm.majorId,
        subjectRef: this.dataForm.subjectId
      }
      this.$api.tevgltchclassroom.listPkgInfoSelect(params).then((res) => {
        if (res.code == 0) {
          this.pkgList = res.data
        }
      })
    },
    showClassList () {
      let params = {
        majorId: this.dataForm.majorId
      }
      this.$api.tevgltchclassroom.getClassList(params).then((res) => {
        if (res.code === 0) {
          this.classList = res.data
        }
      })
    },

    // 获取分页数据
    findPage: function(data) {
      if (data) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      const jj = Object.assign({}, this.filters)
      jj.pageNum = this.pageRequest.pageNum
      jj.pageSize = this.pageRequest.PageSize
      this.$api.tevgltchclassroom.findPage(jj).then((res) => {
        res.data.list.forEach(item => {
          item.pic = baseUrl + item.pic
        })
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function(data) {
      const arr = []
      arr.push(data.row.ctId)
      this.delete(arr, data)
    },
    // 批量删除
    handleBatchDelete: function(data) {
      const arr = []
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].ctId)
      }
      this.delete(arr, data)
    },
    // 执行删除
    delete: function(jj, darass) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.tevgltchclassroom.doDelete(jj).then(res => {
          if (res.code !== 0) { // 删除失败
            this.$message.error(res.msg)
            return
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(null)
          }
        }).then(darass != null ? darass.callback : '').catch(res => {
          this.$message.error('删除失败，请联系管理员!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示新增界面
    handleAdd: function() {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dialogVisible = true
      this.operation = true
      this.$refs['dataForm'].resetFields()
    },
    // 显示修改界面
    handleEdit: function(params) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      // this.dataForm.ctId = params.row.ct_id
      // this.dataForm.majorId = params.row.ct_id
      // this.dataForm.subjectId = params.row.subjectId

      this.dialogVisible = true
      this.operation = false // 标识为修改
      this.$api.tevgltchclassroom.view(params.row.ct_id).then((res) => {
        if (res.code === 0) {
          this.dataForm = Object.assign({}, res.data)
          // 处理switch开关数据
          this.dataForm.isCheck = res.data.isCheck === 'Y' ? true : false
          this.dataForm.isPublic = res.data.isPublic === 'Y' ? true : false
          this.dataForm.ifLiveLesson = res.data.ifLiveLesson === 'Y' ? true : false
          // 获取其它数据
          this.showMajorList()
          this.showSubjectList()
          this.showPkgList()
          this.showClassList()
        }
      })
    },
    // 修改
    submitForm: function(type) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            this.dialogVisible = type === 'saveContinue'
            // 图片处理
            if (this.operation == false){
              if (this.dataForm.pic != null && this.dataForm.pic != ""){
                let arr = this.dataForm.pic.split("/");
                if (arr.length > 1){
                  this.dataForm.pic = arr[arr.length-1];
                }
              }
            }
            const params = Object.assign({}, this.dataForm)
            params.isCheck = this.dataForm.isCheck ? 'Y' : 'N'
            params.isPublic = this.dataForm.isPublic ? 'Y' : 'N'
            params.ifLiveLesson = this.dataForm.ifLiveLesson ? 'Y' : 'N'
            this.$api.tevgltchclassroom.save(params).then((res) => {
              if (res.code === 0) {
                this.$message({ message: '操作成功', type: 'success' })
                if (type === 'saveContinue') {
                  this.$refs['dataForm'].resetFields()
                }
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
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

    turnOver(params) {
      this.dataFormTurnOver.ctId = params.row.ct_id
      this.dataFormTurnOver.teacherId = ''
      this.dataFormTurnOver.name = params.row.name
      this.dataFormTurnOver.title = '移交课堂 【' + params.row.name + '】'
      this.dialogVisibleForTurnOver = true
    },
    saveTurnOver() {
      console.log(this.dataFormTurnOver)
      this.$refs.formTurnOver.validate((valid) => {
        if (valid) {
          const teacherData = this.teacherList.find(a => a.teacherId === this.dataFormTurnOver.teacherId)
          const h = this.$createElement
          this.$msgbox({
            title: '注意',
            message: h('p', null, [
              h('span', null, '此操作将把课堂 ' + this.dataFormTurnOver.name),
              h('br', null, ''),
              h('span', null, '移交给【' + teacherData.teacherName + '】掌控吗'),
              h('br', null, ''),
              h('span', null, '原教师将不再拥有此课堂所属权, 是否继续? '),
              h('br', null, ''),
              h('i', { style: 'color: red' }, '请谨慎操作！！！')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '移交中...'
                const formData = new FormData()
                formData.append('ctId', this.dataFormTurnOver.ctId)
                formData.append('traineeId', this.dataFormTurnOver.teacherId)
                this.$api.tevgltchclassroom.turnOver(formData).then(res => {
                  if (res.code === 0) {
                    instance.confirmButtonLoading = false
                    this.$message.success(res.msg)
                    this.findPage()
                  } else {
                    instance.confirmButtonLoading = false
                    this.$message.warning(res.msg)
                  }
                  done()
                })
              } else {
                done()
              }
            }
          })
        }
      })
    },

    /**
       * 结束课堂
       */
    handleEnd(params) {
      const item = params.row
      const h = this.$createElement
      this.$msgbox({
        title: '注意',
        message: h('p', null, [
          h('span', null, '此操作将永久结束该课堂, 是否继续? '),
          h('br', null, ''),
          h('i', { style: 'color: red' }, '建议与课堂教师确认无误之后再进行此操作')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '结束中...'
            const formData = new FormData()
            formData.append('ctId', item.ct_id)
            this.$api.tevgltchclassroom.end(formData).then(res => {
              if (res.code === 0) {
                instance.confirmButtonLoading = false
                this.$message.success(res.msg)
                this.findPage()
              } else {
                instance.confirmButtonLoading = false
                this.$message.warning(res.msg)
              }
              done()
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* .el-select-dropdown__item {
  margin: 5px 0;
} */
</style>
