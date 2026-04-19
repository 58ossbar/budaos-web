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
                  <span>订单编号</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.ofSeriano" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>班级名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.ofName" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>订单状态</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="订单状态" name="ofState" dict="of_state" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <!--<el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>所属机构</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.traineeId" placeholder="学员标识ID" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>-->
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>订单联系人</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.ofLinkman" placeholder="订单联系人" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>订单联系电话</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.ofTelphone" placeholder="订单联系电话" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>紧急联系人</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.sosLinkman" placeholder="紧急联系人" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>紧急联系电话</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.sosTelphone" placeholder="紧急联系电话" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>生成订单时间</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-date-picker
                      v-model="dateList"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

            </el-row>
          </el-collapse-item>
        </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="eao:teaofdorder:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-download" :label="$t('action.exportRoster')" perms="eao:teaofdorder:export" type="primary" :loading="exportLoading" @click="exportRoster" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="eao:teaofdorder:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'

export default {
  components: {
    CbButton
  },
  data () {
    return {
      exportLoading: false,
      dateList: [],
      dataTeaoFdOrder: {},
      size: 'small',
      filters: {
        ofName: ''
      },
      dataForm: {},
      columns: [
        // {prop: 'orgId', label: '所属机构', minWidth: 70},
        {prop: 'ofSeriano', label: '订单编号', minWidth: 100},
        {prop: 'ofName', label: '班级名称', minWidth: 100},
        {prop: 'ofLinkman', label: '订单联系人', minWidth: 80},
        {prop: 'ofTelphone', label: '订单联系电话', minWidth: 80},
        {prop: 'ispx', label: '是否参加培训', minWidth: 80},
        {prop: 'signupType', label: '报名类型', minWidth: 70},
        {prop: 'orderReceivable', label: '应收款', minWidth: 60},
        {prop: 'orderProceeds', label: '实收款', minWidth: 60},
        {prop: 'ofTime', label: '生成订单时间', minWidth: 80},
        {prop: 'ofState', label: '订单状态', minWidth: 70},
        {prop: 'orderRefund', label: '退款金额', minWidth: 70},
        {prop: 'spayment', label: '支付方式', minWidth: 70}

      ],
      btnColumns: [
      ],
      pageResult: {},
      value: '',
      dialogVisible: false,
      operation: false, // true:新增, false:修改
      editDialogVisible: false, // 新增修改界面是否显示
      editLoading: false
    }
  },
  methods: {
    exportRoster () {
      if (!this.pageResult || this.pageResult.totalCount <= 0) {
        this.$message.warning('当前没有数据可以导出')
        return false
      }
      this.$confirm('是否确认导出所有班级成员数据项，共' + this.pageResult.totalCount + '条', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoading = true
        this.$api.teaofdorder.exportExcel(this.filters).then(res => {
          this.exportLoading = false
          if (res.code === 0) {
            console.log(res)
            const fileName = res.data
            this.$api.common.downloadFile(fileName).then(res => {
              if (typeof window.chrome !== 'undefined') {
                // Chrome version
                let link = document.createElement('a')
                // link.href = window.URL.createObjectURL(res);
                link.href = window.URL.createObjectURL(new Blob([res]))
                link.download = fileName
                link.click()
              } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE version
                let blob = new Blob([res], { type: 'application/force-download' })
                window.navigator.msSaveBlob(blob, fileName)
              } else {
                // Firefox version
                let file = new File([res], fileName, { type: 'application/force-download' })
                window.open(URL.createObjectURL(file))
              }
            })
          }
        }).catch(() => {
          this.exportLoading = false
        })
      })
    },
    // 获取分页数据
    findPage: function (data) {
      if (data) {
        this.pageRequest = data.pageRequest
      }
      let jj = Object.assign({}, this.filters)
      if (this.dateList && this.dateList.length) {
        jj.sofTime = this.dateList[0]
        jj.eofTime = this.dateList[1]
      }
      jj.pageNum = this.pageRequest.pageNum
      jj.pageSize = this.pageRequest.PageSize
      this.$api.teaofdorder.findPage(jj).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
