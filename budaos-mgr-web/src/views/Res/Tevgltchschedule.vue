<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <!--表单查询-->
      <el-header v-if="!flag" class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>班级</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-cascader v-model="classIdList" class="widthAll" placeholder="请选择班级" :options="majorClassTreeData" :props="{value: 'id', label: 'name'}" :show-all-levels="false" clearable @change="changeClassIdList"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>老师</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="filters.teacherId" class="widthAll" placeholder="请选择老师" clearable @change="queryScheduleData">
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
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>教室</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="filters.roomId" class="widthAll" placeholder="请选择教室" clearable @change="queryScheduleData">
                  <el-option
                    v-for="item in trainingRoomList"
                    :key="item.roomId"
                    :label="item.roomName"
                    :value="item.roomId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>类型</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <!--<el-select v-model="filters.scheduleState" class="widthAll" placeholder="请选择类型" clearable @change="queryScheduleData">
                  <el-option
                    v-for="dict in scheduleStateList"
                    :key="dict.dictId"
                    :label="dict.dictValue"
                    :value="dict.dictCode">
                  </el-option>
                </el-select>-->
                <cb-dict placeholder="请选择类型" name="scheduleState" dict="scheduleState" type="select" :filters="filters" :change="queryScheduleData" clearable empty-label="全部"></cb-dict>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>课程</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-cascader v-model="subjectIdList" class="widthAll" placeholder="请选择课程" :options="majorSubjectTreeData" :props="{value: 'id', label: 'name'}" :show-all-levels="false" clearable @change="changeSubjectIdList"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button v-if="!flag" icon="fa fa-search" :size="size" :label="$t('action.search')" perms="tch:tevgltchschedule:query" type="primary" @click="queryScheduleData"/>
              <cb-button v-if="!flag" icon="fa fa-search" :size="size" label="重置" perms="tch:tevgltchschedule:query" type="primary" @click="clearQuery"/>
              <cb-button v-if="!flag" :size="size" icon="fa fa-plus" label="进入排课模式" perms="tch:tevgltchschedule:add" type="primary" @click="goToSet" />
              <el-button v-if="flag" :size="size" @click.native="flag = false">{{$t('action.cancel')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表单录入-->
      <el-header v-if="flag" class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <el-form label-width="100px" ref="saveForm" :rules="rules" :inline="true" :model="dataForm" :size="size">
          <el-row v-if="flag" class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span class="cb-required"></span><span>班级</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-cascader v-model="classIdList" class="widthAll" placeholder="请安排班级" :options="majorClassTreeData" :disabled="exchange" :props="{value: 'id', label: 'name', multiple: false}" :show-all-levels="false" collapse-tags clearable @change="queryScheduleData"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span class="cb-required"></span><span>老师</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="filters.teacherId" class="widthAll" placeholder="请安排老师"  :disabled="exchange" clearable @change="queryScheduleData">
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
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span class="cb-required"></span><span>教室</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth" prop="roomId">
                <el-select v-model="dataForm.roomId" class="widthAll" placeholder="请安排教室" @change="changeRoom">
                  <el-option
                    v-for="item in trainingRoomList"
                    :key="item.roomId"
                    :label="item.roomName"
                    :value="item.roomId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>类型</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="dataForm.scheduleState" class="widthAll" placeholder="请选择类型" :disabled="exchange" @change="queryScheduleData">
                  <el-option
                    v-for="dict in scheduleStateList"
                    :key="dict.dictId"
                    :label="dict.dictValue"
                    :value="dict.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>课程</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth">
                <el-cascader v-model="subjectIdList" class="widthAll" placeholder="请安排课程" :disabled="exchange" :options="majorSubjectTreeData" :props="{value: 'id', label: 'name'}" :show-all-levels="false" clearable></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button v-if="flag" icon="fa fa-search" :size="size" :label="$t('action.search')" perms="tch:tevgltchschedule:query" type="primary" @click="queryScheduleData"/>
              <el-button v-if="flag" :size="size" @click.native="cancel">{{$t('action.cancel')}}</el-button>
              <cb-button v-if="flag && !exchange" :size="size" icon="fa fa-plus" :label="$t('action.preservation')" perms="tch:tevgltchschedule:add" type="primary" @click="submitForm" />
              <cb-button v-if="flag && exchange" :size="size" icon="fa fa-plus" label="保存调课记录" perms="tch:tevgltchschedule:add" type="primary" @click="saveExchange" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <div class="top-mid-title">
          <p v-show="isActive==1" style="text-align: center;">
            <span class="g-left" @click="leftClick" style="font-weight: 600">&lt;&nbsp;&nbsp;</span>
            <span class="g-middle"><!--{{nowYear}}年-->{{startTime}}-{{endTime}}</span>
            <span class="g-left" style="font-weight: 600" @click="rightClick">&gt;&nbsp;&nbsp;</span>
          </p>
        </div>
        <div class="in-body-content">
          <!-- 周视图 -->
          <table style="border-collapse: collapse;width:100%;" v-show="isActive==1" v-loading="loading">
            <thead style="background-color: rgb(239, 243, 248);">
            <tr class="theard">
              <td>时间（周/节次）</td>
              <td>周一({{cupnowDateList[0]}})</td>
              <td>周二({{cupnowDateList[1]}})</td>
              <td>周三({{cupnowDateList[2]}})</td>
              <td>周四({{cupnowDateList[3]}})</td>
              <td>周五({{cupnowDateList[4]}})</td>
              <td>周六({{cupnowDateList[5]}})</td>
              <td>周日({{cupnowDateList[6]}})</td>
            </tr>
            </thead>
            <tbody class="tbody-class">
              <tr v-for="dict in timeSlotList">
                <td style="text-align: center">
                  <div>{{ dict.name }}</div>
                  <div>{{ dict.beginTime + ' - ' + dict.endTime }}</div>
                </td>
                <td
                  :class="flag ? (weekList[0].weeks[dict.id] && weekList[0].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[0].weeks[dict.id] && weekList[0].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[0]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[0].weeks[dict.id], cupnowDateListCopy[0])">
                  <div class="parent-container" v-for="item in weekList[0].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[0]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[1].weeks[dict.id] && weekList[1].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[1].weeks[dict.id] && weekList[1].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[1]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[1].weeks[dict.id], cupnowDateListCopy[1])">
                  <div class="parent-container" v-for="item in weekList[1].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[1]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[2].weeks[dict.id] && weekList[2].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[2].weeks[dict.id] && weekList[2].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[2]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[2].weeks[dict.id], cupnowDateListCopy[2])">
                  <div class="parent-container" v-for="item in weekList[2].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[2]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[3].weeks[dict.id] && weekList[3].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[3].weeks[dict.id] && weekList[3].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[3]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[3].weeks[dict.id], cupnowDateListCopy[3])">
                  <div class="parent-container" v-for="item in weekList[3].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[3]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" aria-hidden="true"  @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[4].weeks[dict.id] && weekList[4].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[4].weeks[dict.id] && weekList[4].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[4]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[4].weeks[dict.id], cupnowDateListCopy[4])">
                  <div class="parent-container" v-for="item in weekList[4].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[4]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[5].weeks[dict.id] && weekList[5].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[5].weeks[dict.id] && weekList[5].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[5]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[5].weeks[dict.id], cupnowDateListCopy[5])">
                  <div class="parent-container" v-for="item in weekList[5].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[5]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
                <td
                  :class="flag ? (weekList[6].weeks[dict.id] && weekList[6].weeks[dict.id].disabled ? 'cb-is-disabled' : 'cursor') : ''"
                  :id="weekList[6].weeks[dict.id] && weekList[6].weeks[dict.id].scheduleId"
                  :data-date="cupnowDateListCopy[6]" :data-timeid="dict.id"
                  @click="tdclick($event, dict, weekList[6].weeks[dict.id], cupnowDateListCopy[6])">
                  <div class="parent-container" v-for="item in weekList[6].weeks[dict.id].list" :key="item.scheduleId" :id="item.scheduleId" :data-date="cupnowDateListCopy[6]" :data-timeid="dict.id">
                    <span v-if="item.scheduleState" :class="getMyLabelCss(item.scheduleState)" :data-label="item.scheduleStateName"></span>
                    <i v-if="hasDeletePerms && item.hasDeleteIcon" class="delete-icon fa fa-times" @click="deleteSchedule(item)"></i>
                    <i v-if="!flag && hasChangePerms && item.hasDeleteIcon" class="change-icon fa fa-exchange" title="调课" @click="changeSchedule($event, item)"></i>
                    <div v-if="item.roomName">
                      <div>教室：{{ item.roomName }}</div>
                      <div v-if="item.subjectName">课程：{{ item.subjectName }}</div>
                      <div>班级：{{ item.className }}</div>
                      <div>老师：{{ item.teacherName }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import store from '@/store'
import axios from '@/http/axios'
import CbButton from "@/views/Core/CbButton"
import {getDateInfo} from '@/utils/date'
import {baseUrl} from '../../utils/global'

export default {
  name: "Tevgltchschedule",
  components: {
    'cb-button': CbButton
  },
  data() {
    return {
      // 是否有删除权限
      hasDeletePerms: false,
      // 是否有调课权限
      hasChangePerms: false,
      loading: false,
      dataForm: {
        roomId: '',
        classId: '',
        subjectId: '',
        teacherId: '',
        classIdList: [],
        scheduleState: '1'
      },
      rules: {
        roomId: [ { required: true, message: '请安排教室', trigger: 'change' } ],
      },
      // 存放选中的单元格
      multipleSelection: [],
      // 排课模式
      flag: false,
      // 排课模式下调课模式
      exchange: false,
      currentData: {
        scheduleId: '',
      },
      beginDate: '',
      endDate: '',
      isActive:1,
      nowNumber:1,
      lastDay:"",
      nextDay:"",
      startTime:"",
      nowYear:"",
      nowMonth:"",
      endTime:"",
      arr:[],
      weekListOld:[
        {weeks:{morning:[{time:"8:30"},{time:"10:00"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按2月"},{time:"按2天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按天"},{time:"按天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按天"},{time:"按天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按天"},{time:"按天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按天"},{time:"按天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}},
        {weeks:{morning:[{time:"按天"},{time:"按天"}],afternoon:[{time:"11:10"},{time:"11:30"}],evening:[{time:"18:10"},{time:"18:30"}]}}
      ],
      weekList: [
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        },
        {
          "weeks": {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null
          }
        }
      ],


      dataList:[{day:"30"},{day:"1",time:[{intimes:"按天"},{intimes:"按天"}]},{day:"2"},{day:"3"},{day:"4"},{day:"5",time:[{intimes:"按天"},{intimes:"按天"}]},{day:"6"},{day:"7"},{day:"8"},{day:"9"},{day:"10"},{day:"11"},{day:"12"},{day:"13"},{day:"14"},{day:"15"},{day:"16",time:[{intimes:"按天"},{intimes:"11:30"}]},{day:"17"},{day:"18"},{day:"19"},{day:"20"},{day:"21"},{day:"22"},{day:"23",time:[{intimes:"按天"},{intimes:"按天"}]},{day:"24"},{day:"25"},{day:"26",time:[{intimes:"按天"},{intimes:"按天"}]},{day:"27"},{day:"28"},{day:"29"},{day:"30"},{day:"31"},{day:"1",time:[{intimes:"按天"},{intimes:"18:30"}]},{day:"2"},{day:"3"},{day:"4"},{day:"5"},{day:"6"},{day:"7"},{day:"8"},{day:"9"},{day:"10"}],
      timeSlotList: [],
      // dictList: [
      //   {id: '1', name: '第一大节', beginTime: '08:30', endTime: '10:00' },
      //   {id: '2', name: '第二大节', beginTime: '10:20', endTime: '11:50' },
      //   {id: '3', name: '第三大节', beginTime: '14:00', endTime: '15:30' },
      //   {id: '4', name: '第四大节', beginTime: '15:50', endTime: '17:20' },
      //   {id: '5', name: '第五大节', beginTime: '19:00', endTime: '20:30' },
      //   {id: '6', name: '第六大节', beginTime: '20:50', endTime: '22:30' },
      // ],
      // 班级列表
      classList: [],
      // 课程列表
      subjectList: [],
      // 实训室（教室）
      trainingRoomList: [
        // {roomId: '1', roomName: '1号实训室'},
        // {roomId: '2', roomName: '2号实训室'},
        // {roomId: '3', roomName: '3号实训室'}
      ],
      // 教室列表
      teacherList: [],
      majorClassTreeData: [],
      majorSubjectTreeData: [],
      scheduleStateList: [],
      // 筛选条件
      filters: {
        majorId: '',
        classId: '',
        subjectId: '',
        roomId: '',
        teacherId: '',
        scheduleState: ''
      },
      classIdList: [],
      subjectIdList: [],
      size: 'small',
    }
  },
  computed: {
    cupnowDateList(){
      let array = []
      this.arr.forEach((item, i)=>{
        let ary = item.split("-")

        array.push(ary[1]+"/"+ary[2])
      })
      return array
    },
    cupnowDateListCopy(){
      let array = []
      this.arr.forEach((item)=>{
        let ary = item.split("-")
        if (Number(ary[1]) < 10) {
          ary[1] = '0' + ary[1]
        }
        if (Number(ary[2]) < 10) {
          ary[2] = '0' + ary[2]
        }
        array.push(ary[0] + '-' + ary[1] + '-' + ary[2])
      })
      return array
    },
  },
  watch: {
    'filters.classId': {
      handler(newVal, oldVal) {
        this.queryScheduleData()
      },
      deep: true
    }
  },
  mounted() {
    this.hasDeletePerms = store.state.user.perms.includes('tch:tevgltchschedule:delete')
    //console.log(this.hasDeletePerms, store.state.user.perms)
    this.hasChangePerms = store.state.user.perms.includes('tch:tevgltchschedule:exchange')
    this.getWeeks()
    this.changeTime()
    let date = new Date();
    this.nowYear = date.getFullYear();
    this.nowMonth = date.getMonth() + 1;
    let fatherDataList = getDateInfo(this.nowYear, this.nowMonth)
    this.dataList.forEach((item,index)=>{
      item.day =  fatherDataList[index].day
    })
    // 查询教室
    this.queryTrainingRoomList()
    // 查询课程
    //this.querySubjectList()
    this.queryMajorSubjectTreeData()
    // 查询班级
    //this.queryClassList()
    this.queryMajorClassTreeData()
    // 查询老师
    this.queryTeacherList()
    // 获取数据
    this.queryScheduleData()
    this.queryDictScheduleStateList()
  },
  methods: {
    getMyLabelCss(val) {
      const classMap = {
        1: 'corner-mark schooltime',
        2: 'corner-mark activity',
        3: 'corner-mark holiday',
        4: 'corner-mark self-study',
        5: 'corner-mark other'
      }
      return classMap[Number(val)]
    },
    goToSet() {
      /*if (!this.classIdList || !this.classIdList.length) {
        this.$message.warning('请先选择要安排的班级')
        return false
      }*/
      this.flag = true
      this.filters.flag = 'Y'
      this.$notify({
        title: '温馨提示',
        offset: 150,
        dangerouslyUseHTMLString: true,
        message: `<ul>
                    <li>1.选择班级，选择老师，选择教室，选择课程</li>
                    <li>2.点击选择表格中空白的单元格</li>
                    <li>3.保存</li>
                  </ul>`,
        duration: 2000
      });
      // 携带数据
      this.dataForm.roomId = this.filters.roomId
      this.queryScheduleData()
    },
    cancel() {
      this.flag = false
      this.exchange = false
      this.filters.flag = ''
      this.classIdList = []
      this.multipleSelection = []
      const element = document.querySelector('.tbody-class')
      if (element) {
        const items = element.querySelectorAll('.cb-td-selected')
        items.forEach(item => {
          item.classList.remove('cb-td-selected')
        })
      }
    },
    saveExchange() {
      // 如果没有更换教室
      if (this.currentData.roomId === this.dataForm.roomId) {
        if (this.multipleSelection.length != 1) {
          this.$message.warning('请选择要调整至哪一天，哪个时间段')
          return false
        }
      }
      let data = {
        // 当前被移交的记录
        scheduleId: this.currentData.scheduleId,
        // 被移交至哪一天哪个时间段的教室
        schedule: this.multipleSelection.length ? this.multipleSelection[0].schedule : '',
        timeQuantumId: this.multipleSelection.length ? this.multipleSelection[0].timeQuantumId : '',
        roomId: this.dataForm.roomId
      }
      console.log(data)
      this.$api.tevglTchSchedule.exchangeSchedule(data).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.queryScheduleData()
          this.flag = false
          this.exchange = false
          this.filters.flag = ''
          this.multipleSelection = []
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    submitForm() {
      // 一个教室一个班级的情况
      //this.dataForm.classId = this.dataForm.classIdList ? this.dataForm.classIdList[this.dataForm.classIdList.length - 1] : ''
      let alone = false
      if (this.classIdList.length) {
        for (let i = 0; i < this.classIdList.length; i++) {
          if (typeof this.classIdList[i] === 'string') {
            alone = true
          }
        }
      }
      // 单选的情况
      if (alone) {
        this.dataForm.classId = this.classIdList.length ? this.classIdList[this.classIdList.length -1] : ''
      } else {
        let str = ''
        this.classIdList.forEach(item => {
          str += item[item.length - 1] + ','
        })
        this.dataForm.classId = str ? str.substring(0, str.length - 1) : ''
      }
      this.dataForm.teacherId = this.filters.teacherId
      this.dataForm.subjectId = this.subjectIdList ? this.subjectIdList[this.subjectIdList.length - 1] : ''
      if (!this.dataForm.classId) {
        this.$message.warning('请安排班级')
        return false
      }
      if (!this.dataForm.teacherId) {
        this.$message.warning('请安排老师')
        return false
      }
      if (!this.filters.teacherId || !this.classIdList.length || !this.dataForm.roomId) {
        this.$message.warning('请安排教室')
        return false
      }
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message.warning('请选择要安排的日期和节次')
        return false
      }
      this.dataForm.list = this.multipleSelection
      //console.log(this.dataForm)
      this.$api.tevglTchSchedule.saveBatch(this.dataForm).then(res => {
        if (res.code === 0) {
          // 提示
          this.$message.success(res.msg)
          // 清除已选数据
          this.multipleSelection = []
          //this.classIdList = []
          // 退出排课模式
          this.filters.flag = ''
          this.flag = false
          this.filters.scheduleState = ''
          // 重新加载
          this.queryScheduleData()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    pitchOnClassId(val) {
      let majorId = ''
      for (let i = 0; i < this.majorClassTreeData.length; i++) {
        const major = this.majorClassTreeData[i]
        if (major.children) {
          for (let j = 0; j < major.children.length; j++) {
            if (major.children[j].id === val) {
              majorId = major.id
              break
            }
          }
        }
      }
      if (majorId && val) {
        this.classIdList = [majorId, val]
      }
    },
    pitchOnSubjectId(val) {
      if (!val) {
        return false
      }
      let majorId = ''
      for (let i = 0; i < this.majorSubjectTreeData.length; i++) {
        const major = this.majorSubjectTreeData[i]
        if (major.children) {
          for (let j = 0; j < major.children.length; j++) {
            if (major.children[j].id === val) {
              majorId = major.id
              break
            }
          }
        }
      }
      if (majorId && val) {
        this.subjectIdList = [majorId, val]
      }
    },
    changeSchedule(event, myData) {
      event.stopPropagation()
      this.flag = true
      this.filters.flag = 'Y'
      this.exchange = true
      this.filters.teacherId = myData.teacherId
      this.pitchOnClassId(myData.classId)
      this.pitchOnSubjectId(myData.subjectId)
      this.dataForm.roomId = myData.roomId
      this.dataForm.scheduleState = myData.scheduleState
      // 重置原先就被选中的
      if (this.currentData.scheduleId) {
        const ele = document.getElementById(this.currentData.scheduleId)
        if (ele) {
          ele.classList.remove('cb-td-selected')
        }
      }
      // 选中当前被调的记录
      let ele = document.getElementById(myData.scheduleId)
      if (ele) {
        const td = ele.parentNode
        if (td.tagName === 'TD') {
          const divs = td.querySelectorAll('.parent-container')
          if (divs.length == 1) {
            ele = td
          }
        }
        if (!ele.classList.contains('cb-td-selected')) {
          this.currentData = myData
          this.$nextTick(() => {
            ele.classList.add('cb-td-selected')
          })
        }
      }
      this.$notify({
        title: '温馨提示',
        offset: 150,
        dangerouslyUseHTMLString: true,
        message: `<ul>
                    <li>1.您已选好本次要调课的记录</li>
                    <li>2.接下来</li>
                    <li>可以选择调整至哪一天哪个时间</li>
                    <li>或者，更换教室</li>
                  </ul>`,
        duration: 3000
      });
    },
    // 重置样式
    resetClass() {
      const element = document.querySelector('.tbody-class')
      if (element) {
        let list = element.querySelectorAll('.cb-td-selected')
        list.forEach(td => {
          if (td.id != this.currentData.scheduleId) {
            td.classList.remove('cb-td-selected')
          }
        })
        if (!list || !list.length) {
          list = element.querySelectorAll('td')
        }
        // 重新设置
        list.forEach(td => {
          td.classList.remove('cb-td-selected')
          this.multipleSelection.forEach(select => {
            const v1 = td.getAttribute('data-date') == select.schedule
            const v2 = td.getAttribute('data-timeid') == select.timeQuantumId
            if (v1 && v2) {
              td.classList.add('cb-td-selected')
            }
          })
          this.$nextTick(() => {
            const divs = td.querySelectorAll('.parent-container')
            if (divs.length === 1) {
              const o1 = td.getAttribute('data-date') == this.currentData.schedule
              const o2 = td.getAttribute('data-timeid') == this.currentData.timeQuantumId
              if (o1 && o2) {
                this.$nextTick(() => {
                  td.classList.add('cb-td-selected')
                })
              }
            } else {
              for (let i = 0; i < divs.length; i++) {
                const o1 = divs[i].getAttribute('data-date') == this.currentData.schedule
                const o2 = divs[i].getAttribute('data-timeid') == this.currentData.timeQuantumId
                if (o1 && o2) {
                  this.$nextTick(() => {
                    divs[i].classList.add('cb-td-selected')
                  })
                  break
                }
              }
            }
          })

        })
      }
    },
    resetBackground(myData, ele) {
      // 清空全部
      if (!ele) {
        return false
      }
      console.log(ele)
      // 清空指定
      if (!ele.classList.contains('cb-td-selected')) {
        // 清空原有数据
        this.multipleSelection = []
        const element = document.querySelector('.tbody-class')
        if (element) {
          const list = element.querySelectorAll('.cb-td-selected')
          list.forEach(td => {
            const divs = td.querySelectorAll('.parent-container')
            if (divs.length === 1) {
              if (divs[0].id != this.currentData.scheduleId) {
                td.classList.remove('cb-td-selected')
              }
            } else {
              if (td.id != this.currentData.scheduleId) {
                td.classList.remove('cb-td-selected')
              }
            }
          })
        }
        // 重新设置
        ele.classList.add('cb-td-selected')
        this.multipleSelection.push(myData)
      } else {
        ele.classList.remove('cb-td-selected')
        this.multipleSelection = []
      }
      return true
    },
    // 清空所有背景色
    clearBackground() {
      const tbody = document.querySelector('.tbody-class')
      console.log(tbody)
    },
    tdclick(event, dict, data, time) {
      if (!this.flag) {
        return false
      }
      // 如果不允许点击
      if (data && data.disabled) {
        return false
      }
      // console.log(time, dict.timeQuantumId, dict.name, dict.beginTime, dict.endTime)
      let myData = {
        scheduleId: data ? data.scheduleId : '',
        timeQuantumId: dict.timeQuantumId,
        schedule: time
      }
      // 如果是调课模式，执行此段代码，后面代码无需理会
      if (this.exchange) {
        // 出现选中样式
        const ele = event.target
        if (ele) {
          // 如果点击的不是单元格
          if (ele.tagName != 'TD') {
            return false
          }
          // 否则，需要考虑，有多个的情况
          const divs = ele.querySelectorAll('.parent-container')
          if (divs.length >= 2) {
            return false
          }
          // 如果没选中，则选中
          this.resetBackground(myData, ele)
        }
        return false
      }
      // 如果是排课模式下
      // 如果没有选中班级或老师
      if (!this.classIdList.length) {
        this.$message.warning('请先选择要安排的班级')
        return false
      }
      if (!this.filters.teacherId) {
        this.$message.warning('请先选择要安排的老师')
        return false
      }
      if (!this.dataForm.roomId) {
        this.$message.warning('请先选择要安排的教室')
        return false
      }
      // 出现选中样式
      let ele = event.target
      if (ele) {
        const td = this.findTd(ele)
        // 如果没选中，则选中
        if (!td.classList.contains('cb-td-selected')) {
          td.classList.add('cb-td-selected')
          //ele.innerHTML = '已选择'
          // 且放入数组
          this.multipleSelection.push(myData)
        } else {
          td.classList.remove('cb-td-selected')
          //ele.innerHTML = ''
          this.multipleSelection = this.multipleSelection.filter(v => !(v.timeQuantumId == myData.timeQuantumId && v.schedule == myData.schedule))
        }
        /*// 可能点击的是td里面的元素
        if (!ele.classList.contains('parent-container') && ele.tagName === 'DIV') {
          ele = ele.parentNode.parentNode
        }
        // 如果没选中，则选中
        if (!ele.classList.contains('cb-td-selected')) {
          ele.classList.add('cb-td-selected')
          //ele.innerHTML = '已选择'
          // 且放入数组
          this.multipleSelection.push(myData)
        } else {
          ele.classList.remove('cb-td-selected')
          //ele.innerHTML = ''
          this.multipleSelection = this.multipleSelection.filter(v => !(v.timeQuantumId == myData.timeQuantumId && v.schedule == myData.schedule))
        }*/
      }
    },
    findTd(ele) {
      if (!ele) {
        return null
      }
      if (ele.tagName === 'TD') {
        return ele
      }
      if (ele.tagName !== 'TD') {
        return this.findTd(ele.parentNode)
      }
    },
    leftClick() {
      if (!this.classIdList.length && !this.filters.teacherId && !this.filters.roomId) {
        this.$message.warning('试试看先选择班级、老师、教室中的任意一个条件')
        return false
      }
      if (this.loading) {
        this.$message.warning('点得太快啦，还在加载数据中...')
        return false
      }
      let d = this.getMonDate(this.nowDate("s",-1,this.arr[0]))
      let arr = [];
      for(let i=0; i<7; i++) {
        arr.push(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
        d.setDate(d.getDate()+1);
      }
      this.arr = arr
      this.changeTime()
      this.queryScheduleData()
    },
    rightClick() {
      if (!this.classIdList.length && !this.filters.teacherId && !this.filters.roomId) {
        this.$message.warning('试试看先选择班级、老师、教室中的任意一个条件')
        return false
      }
      if (this.loading) {
        this.$message.warning('点得太快啦，还在加载数据中...')
        return false
      }
      const strList = this.arr[0].split('-')
      const month = Number(strList[1]) < 10 ? '0' + strList[1] : strList[1]
      const day = Number(strList[2]) < 10 ? '0' + strList[2] : strList[2]
      const myDate = strList[0] + '-' + month + '-' + day
      // let d = this.getMonDate(this.nowDate("s",1,this.arr[6])) // 该方法有BUG，往右点击，直接跳过了一周的时间
      const res = this.addDate(new Date(myDate), 7)
      let d = this.getMonDate(res)
      let arr = [];
      for(let i=0; i<7; i++) {
        arr.push(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
        d.setDate(d.getDate()+1);
      }
      this.arr = arr
      this.changeTime()
      this.queryScheduleData()
    },
    changeTime() {
      let start = this.arr[0]
      let timelist =  start.split("-")
      this.startTime =  timelist[0]+'年'+timelist[1]+"月"+timelist[2]+"日"
      let start2 = this.arr[6]
      let timelist1 =  start2.split("-")
      this.endTime =  timelist1[0]+'年'+timelist1[1]+"月"+timelist1[2]+"日"
      this.beginDate = timelist[0] +'-'+timelist[1]+"-"+timelist[2]
      this.endDate =  timelist1[0] +'-'+timelist1[1]+"-"+timelist1[2]
    },
    nowDate(type, dates,date){
      var now = ""
      if(date){
        now = new Date(date);
      }else{
        now = new Date()
      }
      var nowTime = now.getTime();
      var day = now.getDay();
      var longTime = 24 * 60 * 60 * 1000;
      var n = longTime * 7 * (dates || 0);
      if (type == "s") {
        var dd = nowTime - (day - 1) * longTime + n;
      };
      if (type == "e") {
        var dd = nowTime + (7 - day) * longTime + n;
      };
      dd = new Date(dd);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      m = m < 10 ? "0" + m: m;
      d = d < 10 ? "0" + d: d;
      var day = y + "-" + m + "-" + d;
      return day;
    },
    /**
     * 获取每周的日子
     */
    getWeeks(){
      let d = this.getMonDate(this.nowDate("s"))
      let arr = [];
      for(let i = 0; i < 7; i++) {
        arr.push(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());
        d.setDate(d.getDate() + 1);
      }
      this.arr = arr
    },
    getMonDate(data) {
      var d=new Date(data)
      var day=d.getDay()
      var date=d.getDate()
      if(day==1)
        return d;
      if(day==0)
        d.setDate(date-6);
      else
        d.setDate(date-day+1);
      return d;
    },
    getDayName(day) {
      var day=parseInt(day);
      if(isNaN(day) || day<0 || day>6)
        return false;
      var weekday=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
      return weekday[day];
    },
    /**
     * 添加
     * @param date
     * @param n 添加几天
     */
    addDate(date, n) {
      date.setDate(date.getDate()+n)
      return date
    },
    queryClassList() {
      const params = {
        majorId: this.filters.majorId,
        className: ''
      }
      this.$api.tevgltchclass.listClassTrainee(params).then(res => {
        if (res.code === 0) {
          this.classList = res.data
        }
      })
    },
    querySubjectList() {
      const params = {
        majorId: this.filters.majorId
      }
      this.$api.tevglbooksubject.querySubjectList(params).then(res => {
        if (res.code === 0) {
          this.subjectList = res.data
        }
      })
    },
    queryTeacherList() {
      this.$api.tevgltchclassroom.queryTeacherList({hasTraineeId: 'Y'}).then(res => {
        res.data.forEach(item => {
          item.teacherPic = baseUrl + item.teacherPic
        })
        this.teacherList = res.data
      })
    },
    queryDictScheduleStateList() {
      const queryData = {
        sidx:  'SORT_NUM',
        order: 'asc',
        dictType: 'scheduleState'
      }
      axios({
        url: '/api/sys/dict/cbdict',
        method: 'get',
        params: queryData
      }).then(res => {
        this.scheduleStateList = res.data;
      });
    },
    changeClassIdList(v) {
      this.filters.classId = v[v.length - 1]
      this.queryScheduleData()
    },
    changeSubjectIdList(v) {
      this.filters.subjectId = v[v.length - 1]
      this.queryScheduleData()
    },
    changeMajor() {
      this.filters.classId = ''
      this.filters.subjectId = ''
      //this.queryClassList()
      //this.querySubjectList()
    },
    changeRoom(v) {
      this.filters.roomId = v
      this.queryScheduleData()
    },
    clearQuery() {
      this.filters = {}
      this.classIdList = []
      this.subjectIdList = []
      this.queryScheduleData()
    },
    queryScheduleData() {
      this.filters.type = this.dataForm.scheduleState
      this.filters.beginDate = this.getBeginDate()
      this.filters.endDate = this.getEndDate()
      let alone = false
      if (this.classIdList.length) {
        for (let i = 0; i < this.classIdList.length; i++) {
          if (typeof this.classIdList[i] === 'string') {
            alone = true
            break
          }
        }
      }
      // 单选的情况
      if (alone) {
        this.filters.classId = this.classIdList.length ? this.classIdList[this.classIdList.length -1] : ''
      } else {
        let str = ''
        this.classIdList.forEach(item => {
          str += item[item.length - 1] + ','
        })
        if (this.flag) {
          this.filters.classId = str ? str.substring(0, str.length - 1) : ''
        } else {
          const classIdString = str ? str.substring(0, str.length - 1) : ''
          this.filters.classId = classIdString.split(',')[0]
          if (this.classIdList.length) {
            const tempArr = this.classIdList
            this.classIdList = tempArr[0]
          }
        }
      }
      this.filters.subjectId = this.subjectIdList ? this.subjectIdList[this.subjectIdList.length - 1] : ''
      //console.log('查询条件', this.filters)
      this.loading = true
      this.$api.tevglTchSchedule.queryScheduleData(this.filters).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.weekList = res.data.weekList
          this.timeSlotList = res.data.timeSlotList
          // 额外处理
          if (this.flag) {
            this.weekList.forEach(day => {
              const yyyyMMdd = day.date
              for (let key in day.weeks) {
                this.multipleSelection.forEach(selection => {
                  // 如果某天某时段，匹配上了，移除掉，因为这个是不能被选择的
                  if (yyyyMMdd == selection.schedule && key == selection.timeQuantumId && day.weeks[key] != null) {
                    //this.multipleSelection = this.multipleSelection.filter(v => !(v.timeQuantumId == selection.timeQuantumId && v.schedule == selection.schedule))
                  }
                })
              }
            })
            if (this.flag && !this.exchange) {
              const element = document.querySelector('.tbody-class')
              if (element) {
                let list = element.querySelectorAll('td')
                // 重新设置
                list.forEach(td => {
                  this.multipleSelection.forEach(select => {
                    const v1 = td.getAttribute('data-date') == select.schedule
                    const v2 = td.getAttribute('data-timeid') == select.timeQuantumId
                    if (v1 && v2) {
                      this.$nextTick(() => {
                        td.classList.add('cb-td-selected')
                      })
                    } else {
                      td.classList.remove('cb-td-selected')
                    }
                  })
                })
              }
            }
            if (this.exchange) {
              this.resetClass()
            }
          }
        }
      })
    },
    deleteSchedule(o) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.tevglTchSchedule.deleteAlone(o.scheduleId).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '删除成功!'})
            this.queryScheduleData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      }).catch(() => {
      });
    },
    queryMajorClassTreeData() {
      this.$api.tevglbookmajor.queryMajorClassTreeData().then(res => {
        res.data.forEach(item => {
          if (!item.children || item.children.length == 0) {
            item.disabled = true
          }
        })
        this.majorClassTreeData = res.data
      })
    },
    queryMajorSubjectTreeData() {
      this.$api.tevglbookmajor.queryMajorSubjectTreeData().then(res => {
        this.majorSubjectTreeData = res.data
      })
    },
    queryTrainingRoomList() {
      this.$api.tevglTchSchedule.queryTrainingRoomList().then(res => {
        if (res.code === 0) {
          this.trainingRoomList = res.data
        }
      })
    },
    getBeginDate() {
      let str = ''
      const arr = this.beginDate.split('-')
      for (let i = 0; i < arr.length; i++) {
        if (Number(arr[i]) < 10) {
          arr[i] = '0' + arr[i]
        }
        str += arr[i] + '-'
      }
      //return str ? this.nowYear + '-' + str.substring(0, str.length - 1): null
      return str ? str.substring(0, str.length - 1): null
    },
    getEndDate() {
      let str = ''
      const arr = this.endDate.split('-')
      for (let i = 0; i < arr.length; i++) {
        if (Number(arr[i]) < 10) {
          arr[i] = '0' + arr[i]
        }
        str += arr[i] + '-'
      }
      //return str ? this.nowYear + '-' + str.substring(0, str.length - 1): null
      return str ? str.substring(0, str.length - 1): null
    }
  }
}
</script>

<style scoped>
  .cb-required:before{
    content: '*';
    color: #f56c6c;
  }
  .cb-td-selected{
    background-color: #C1FFC1;
  }
  .cb-is-disabled{
    color: #C0C4CC;
    cursor: not-allowed;
  }
  .cursor{
    cursor: pointer;
  }
  .top-mid-title{
    width: 280px;
    /*margin: 0 auto;*/
    margin: 10px auto;
    cursor: pointer;
  }
  .top-mid-title p{
    margin: 0;
  }
  .top-mid-color{
    display: flex;
    width: 200px;
    margin-top: 20px;
    margin-left: 25px;

  }
  .color-noclass{
    width: 30px;
    height: 15px;
    background-color: rgb(54,155,255);
    margin-top: 5px;
  }
  .color-yesclass{
    width: 30px;
    height: 15px;
    background-color: rgb(156,172,208);
    margin-top: 5px;
  }
  .top-left-tips>span.class-left{
    border-left: none;
  }
  .word-day>span{
    display: inline-block;
  }
  .word-week{
    width: 17px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    border: 1px black solid;
    margin-right: 5px;
    font-size: 10px;
    cursor: pointer;
  }
  .color-word-ban{
    color: rgb(64, 158, 255);
    border: 1px solid rgb(64, 158, 255);
  }
  .change-color-tips{
    background-color:rgb(64, 158, 255);
  }
  .in-body-content{
    width: 100%;
    /* height: 400px; */
    /* border: 1px solid red; */
    margin-top: 10px;
  }
  .theard td{
    width: 200px;
    height: 50px;
    /*border: 1px solid grey;*/
    border: 1px solid #DCDFE6;
    text-align: center;
  }
  .tbody-class td{
    width: 200px;
    height: 80px;
    /*border: 1px solid grey;*/
    border: 1px solid #DCDFE6;
    padding: 0;
  }
  .class-relative{
    position: relative;
  }
  .class-absolute{
    position: absolute;
    left: 0;
    top: 3px;
    width: 30px;
    height: 15px;
    background-color: rgb(182, 204, 227);
    font-size: 10px;
    line-height: 15px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    text-align: center;
  }
  .class-absolute-teacher{
    position: absolute;
    left: 0;
    top: 3px;

  }
  .class-ban-day-gary{
    width: 33px;
    height: 15px;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
    background-color: rgb(156, 172, 208);
    display: inline-block;
    margin-right: 5px;
  }
  .class-ban-day-blue{
    width: 33px;
    height: 15px;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
    background-color: rgb(84, 133, 220);
    display: inline-block;
    margin-right: 5px;
  }

  .parent-container {
    position: relative;
    overflow: hidden;
    /*height: 100%;*/
  }
  .parent-container:hover .delete-icon{
    display: block;
  }
  .parent-container:hover .change-icon{
    display: block;
  }
  /*删除的小图标*/
  .delete-icon {
    color: red;
    position: absolute;
    top: 0;
    right: 3px;
    cursor: pointer;
    font-size: 14px;
    /*先隐藏，鼠标经过父容器时，再显示*/
    display: none;
  }
  /*调课的图标*/
  .change-icon {
    color: red;
    position: absolute;
    top: 20px;
    right: 3px;
    cursor: pointer;
    font-size: 14px;
    z-index: 999;
    /*先隐藏，鼠标经过父容器时，再显示*/
    display: none;
  }
  .corner-mark {
    position: absolute;
    left: 0px;
    top:0px;
  }
  /*上课*/
  .corner-mark.schooltime::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #ff7f27;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*活动日*/
  .corner-mark.activity::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #87CEEB;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*放假*/
  .corner-mark.holiday::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #3CB371;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
  /*晚自习*/
  .corner-mark.self-study::before{
    content: attr(data-label);
    color:#FFFFFF;
    text-align: center;
    font-size: .857em;
    position: absolute;
    top: 0px;
    left: -20px;
    background-color: #2F4F4F;
    transform: rotate(-39deg);
    overflow: hidden;
    width:65px;
  }
</style>
