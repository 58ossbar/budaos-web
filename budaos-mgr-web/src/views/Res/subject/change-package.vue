<template>
  <div class="chapter-area-content">
    <el-dialog
      width="80%"
      v-dialogDrag
      top="8vh"
      :title="subjectName"
      :visible.sync="dialogVisibleActual"
      @close="handleClose"
    >
      <div style="margin: 10px;text-align: center;">
        请在这里选择要移交给谁
        <el-select v-model="dataFormTurnOver.traineeId" placeholder="请选择移交给哪位教师">
          <el-option
            v-for="item in teacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.traineeId">
            <div style="float: left"><el-image style="width: 30px; height: 30px;border-radius: 50%;" :src="item.teacherPic" fit="fill"></el-image></div>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
          </el-option>
        </el-select>
        请在表格中勾选要移交的教学包。
        最后，点击【保存】按钮
      </div>
      <div style="margin: 10px;">
        <el-table
          ref="multipleTable"
          :data="pageResult.list"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="pkgLogo" label="教学包封面" width="180">
            <template slot-scope="scope">
              <el-popover placement="right" title="" trigger="hover">
                <img :src="scope.row.pkgLogo" style="max-width: 300px; max-height: 300px"/>
                <img slot="reference" style="width: 40px;height: 40px;display: block;border-radius: 50%" :src="scope.row.pkgLogo" @click="dataTypeClick($event, scope.$index, scope.row, column.callback)" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="pkgName" label="教学包名称" min-width="200"></el-table-column>
          <el-table-column prop="pkgVersion" label="版本号" width="80"></el-table-column>
          <el-table-column prop="traineeName" label="创建者" width="100"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
          <el-table-column prop="receiverUserName" label="接管者名称" width="160"></el-table-column>
          <el-table-column prop="receiverUserMobile" label="接管者手机"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="handleClose">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="changePackage"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {baseUrl} from '@/utils/global'

export default {
  name: 'ChangePackage',
  props: {
    // 用于控制是否显示弹出层
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    // 课程id
    subjectId: {
      type: String,
      default: '',
      required: true
    },
    // 课程名称
    subjectName: {
      type: String,
      default: '',
      required: true
    },
    // 课程简介
    subjectInfo: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    size: {
      type: '',
      default: 'small',
      required: false
    }
  },
  watch: {
    'dialogVisible': {
      handler (newVal) {
        this.dialogVisibleActual = newVal
        if (this.dialogVisibleActual) {
          this.queryTeacherList()
          this.findPage()
        }
      }
    }
  },
  data () {
    return {
      filters: {
        pageNum: 1,
        pageSize: 10,
        subjectId: this.subjectId
      },
      dataFormTurnOver: {
        ctId: '',
        name: '',
        teacherName: '',
        traineeId: ''
      },
      teacherList: [],
      multipleSelection: [],
      pageResult: {
        list: [],
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0
      },
      currentName: '',
      type: 'subject',
      dialogVisibleActual: this.dialogVisible,
      editLoading: false,
      nodeList: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'chapterName'
      },
      dataForm: {
        chapterId: '',
        chapterContent: ''
      },
      // 是否显示章节信息填写页面
      innerVisible: false,
      editLoadingInner: false,
      innerTitle: '添加章节'
    }
  },
  mounted () {
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      /* if (val && val.length) {
          this.multipleSelection = [val[val.length-1]]
        } */
      // this.$refs.multipleTable.clearSelection()
      // this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0], true);
    },
    handleClose (evt) {
      this.dataFormTurnOver.traineeId = ''
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.$emit('close', evt)
      this.type = 'subject'
    },
    changePackage () {
      if (!this.multipleSelection || this.multipleSelection.length === 0) {
        this.$message.warning('请至少勾选一个需要被移交的教学包')
        return false
      }
      if (!this.dataFormTurnOver.traineeId) {
        this.$message.warning('请选择要移交给哪位老师')
        return false
      }
      this.editLoading = true
      const postData = {
        traineeId: this.dataFormTurnOver.traineeId,
        pkgIdList: this.multipleSelection.map(a => a.pkgId)
      }
      this.$api.pkg.save(postData).then(res => {
        this.editLoading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.multipleSelection = []
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(() => {
        this.editLoading = false
      })
    },
    queryTeacherList () {
      this.$api.tevgltchclassroom.queryTeacherList().then(res => {
        res.data.forEach(item => {
          item.teacherPic = baseUrl + item.teacherPic
        })
        this.teacherList = res.data
      })
    },
    findPage () {
      this.filters.subjectId = this.subjectId
      this.$api.pkg.findPage(this.filters).then(res => {
        res.data.list.forEach(item => {
          item.pkgLogo = baseUrl + item.pkgLogo
        })
        this.pageResult = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
