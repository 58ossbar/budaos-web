<template>
  <el-dialog v-dialogDrag title="修改状态" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-card class="box-card">
      <el-form ref="queryForm" class="queryForm" label-width="100px" :inline="true" :model="filters" :size="size">
        <el-row>
          <el-col :span="2">
            <el-form-item class="dictInputQueryLabelWidth">
              <span>学员姓名</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="dictInputQueryWidth ">
              <el-input v-model="filters.traineeName" placeholder="姓名/昵称" clearable @clear="findTraineeList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item class="dictInputQueryLabelWidth">
              <span>手机号码</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="dictInputQueryWidth ">
              <el-input v-model="filters.mobile" placeholder="手机号码" clearable @clear="findTraineeList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item class="dictInputQueryLabelWidth">
              <span>所属性别</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="dictInputQueryWidth ">
              <cb-dict placeholder="学员性别" name="traineeSex" dict="sex" type="select" :filters="filters" :change="findTraineeList" empty-label="全部" clearable @clear="findTraineeList"></cb-dict>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="elDeptFormButton dictQueryCenterButton">
          <el-col :span="24">
            <cb-button icon="fa fa-search" :label="$t('action.search')" perms="tch:tevgltchclassroom:query" type="primary" :loading="queryLoading" @click="findTraineeList" />
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="c-text">将选中的学员，设为课堂结束后，依旧允许学生进入课堂</div>
      <el-table
        ref="multipleTable"
        row-key="id"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="traineePic" label="头像" width="70">
          <template slot-scope="scope">
            <img style="width: 40px;height: 40px;display: block;border-radius: 50%" :src="scope.row.traineePic" />
          </template>
        </el-table-column>
        <el-table-column prop="traineeName" label="姓名" min-width="180"></el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="180"></el-table-column>
        <el-table-column prop="traineeSexName" label="性别"></el-table-column>
        <el-table-column prop="joinDate" label="加入课堂时间"></el-table-column>
      </el-table>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button :size="size" type="primary" :loading="editLoading" @click.native="submitForm">{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>

</template>

<script>
import CbButton from '@/views/Core/CbButton'

export default {
  components: {
    CbButton
  },
  data () {
    return {
      filters: {},
      dialogVisible: false,
      queryLoading: false,
      editLoading: false,
      size: 'small',
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    handleAdd (item) {
      this.filters.ctId = item.ct_id
      this.dialogVisible = true
      this.findTraineeList()
    },
    findTraineeList () {
      this.queryLoading = true
      this.$api.tevgltchclassroom.findClassroomTraineeList(this.filters).then((res) => {
        this.queryLoading = false
        if (res.code === 0) {
          this.tableData = res.data
          const rows = res.data.filter(a => a.accessState === 'Y')
          this.$nextTick(() => {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          })
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(() => {
        this.queryLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    submitForm () {
      this.editLoading = true
      let msg = '确定将选中的学员，设为课堂结束后，允许再进入课堂吗'
      if (!this.multipleSelection || !this.multipleSelection.length) {
        msg = '当前没有选中任何学员，将设置整个课堂学生不再允许进入课堂！'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = this.multipleSelection.map(a => a.id)
        this.$api.tevgltchclassroom.batchUpdateAccessState(this.filters.ctId, arr).then(res => {
          this.editLoading = false
          if (res.code === 0) {
            this.$message.success(res.msg)
            this.dialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.editLoading = false
        })
      }).catch(() => {
        this.editLoading = false
      })
    }
  }
}
</script>

<style scoped>
.box-card{
  margin: 10px;
}
.c-text {
  margin-bottom: 10px;
}
</style>
