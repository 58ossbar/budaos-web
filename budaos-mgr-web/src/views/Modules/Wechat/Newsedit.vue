<template>
  <el-container class="page-container scrollAllY">
    <el-aside class="LeftPadding marginBottom leftWrap">
      <div class="bgcolor box_shadows" :style="{width:(oneImgWidth)+'px'}">
        <!-- 列表显示 begin -->
        <template v-if="leftInfo && leftInfo.length > 0">
          <div v-for="(item0,index0) in leftInfo" :key="index0" :class="[index0 == 0?'pre-first-wrap':'pre-two-wrap', currIndex == index0 ?'pre-active':'']"  :style="{height:(index0 == 0 ?(oneImgHight+'px'):'auto'),width:((index0 == 0 ?(oneImgWidth+'px'):'auto'))}" :title="'第'+(index0+1)+'篇图文'" v-popover:preHoverRef   @click="handleClick(index0,$event)" @mouseenter="handleMouseEnter(index0,$event)">
            <!-- 一级 begin -->
            <template v-if="index0 == 0">
              <div class="pre-first-img-wrap">
                <el-image class="pre-first-img" v-if="item0 && item0.newsLogo" :src="item0.newsLogo"></el-image>
              </div>
              <div class="pre-first-label hide_double">{{item0.newTitle || '标题'}}</div>
            </template>
            <!-- 一级 end -->
            <!-- 二级 begin -->
            <template v-else>
              <div class="pre-two-label hide_double">{{item0.newTitle || '标题'}}</div>
            <div :style="{height:(twoImgHight)+'px',width:(twoImgWidth)+'px'}" class="pre-two-img-wrap">
              <el-image class="pre-two-img" v-if="item0 && item0.newsLogo" :src="item0.newsLogo"></el-image>
            </div>
            </template>
            <!-- 二级 end -->


            <!-- <div class="pre-hover-wrap">
              <div class="pre-hover-item"><i class="el-icon-top"></i></div>
              <div class="pre-hover-item"><i class="el-icon-bottom"></i></div>
              <div class="pre-hover-item"><i class="el-icon-delete"></i></div>
            </div> -->

          </div>

        </template>
        <!-- 列表显示 end -->
        <!-- 添加 新 消息 begin -->
        <div class="pre-add" @click="toAddNews">
          <i class="el-icon-plus"></i>
          <span>新建消息</span>
        </div>
         <!-- 添加 新 消息 end -->
      </div>

    </el-aside>
    <!-- trigger="hover" -->
    <el-popover ref="preHoverRef" v-model="preHoverInfo.isShow"  placement="right" popper-class="pre-hover-popover">
      <!-- 悬浮按钮 begin -->
      <div class="pre-hover-wrap">
        <el-tooltip v-if="currIndex > 0" effect="dark"  content="上移" placement="left">
            <div class="pre-hover-item" @click="toClickMoveBtn('up')">
              <i class="el-icon-top"></i>
            </div>
        </el-tooltip>
        <el-tooltip effect="dark" v-if="currIndex < (leftInfo.length - 1)" content="下移" placement="left">
            <div class="pre-hover-item" @click="toClickMoveBtn('dowm')">
              <i class="el-icon-bottom"></i>
            </div>
        </el-tooltip>
        <el-tooltip v-if="currIndex > 0" effect="dark" content="删除" placement="left">
            <div class="pre-hover-item" @click="toClickDelBtn()">
              <i class="el-icon-delete"></i>
            </div>
        </el-tooltip>

        <div v-show="preHoverInfo.isClickDel" class="pre-hover-item-del-confirm-wrap">
          <div class="bgcolor box_shadows pre-hover-item-del-confirm-inner">
            <p>是否确定删除此篇内容<span v-if="dataForm && dataForm.newTitle">：{{dataForm.newTitle}}</span>？</p>
            <div class="pre-hover-item-del-confirm">
              <el-button size="mini" type="text" @click="showOrHidePreHoverPopu">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDel">确定</el-button>
            </div>
          </div>
        </div>

        <!-- <div class="pre-hover-item" >
          <i class="el-icon-delete"></i>

          <div v-show="item0.isClickDel" class="pre-hover-item-del-confirm-wrap">
            <p>是否确定删除此篇内容<span v-if="item0 && item0.newTitle">：{{item0.newTitle}}</span>？</p>
            <div class="pre-hover-item-del-confirm">
              <el-button size="mini" type="text" @click="item0.isClickDel = false">取消</el-button>
              <el-button type="primary" size="mini" @click="item0.isClickDel = false">确定</el-button>
            </div>
          </div>

        </div> -->
      </div>
    </el-popover>


    <el-main class="box_shadows bgcolor  scrollRightYDictMenu marginBottom">
      <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm"
                 label-width="120px" :size="size"  :disabled="isNotEdit"
                 class="textAlign"> <!-- label-position="left"  status-icon  -->
        <el-row>
          <el-col :span="24" class="right-label-span">
            <span class="deptInfoSpan">
              {{!dataForm.newsId ? $t('action.add')+'资讯' : (!isNotEdit?$t('action.edit')+'资讯':$t('action.readOnly')+'资讯')}}</span>
          </el-col>
        </el-row>
        <el-row>

           <el-col  :span="16">
                  <el-form-item label="资讯标题" prop="newTitle" >
                    <el-input v-model="dataForm.newTitle" placeholder="资讯标题" type="textarea"   clearable rows="3" :show-word-limit="true"></el-input><!--maxlength="50"-->
                  </el-form-item>

                  <el-form-item label="资讯分类" prop="officialLinkType">
                    <cb-dict :parentVue="this._self" placeholder="资讯分类" name="officialLinkType" dict="official_link_type" type="select" :dataForm="dataForm" :disabled="currIndex > 0"></cb-dict>
                  </el-form-item>

                   <el-form-item label="资讯作者" prop="author" >
                    <el-input v-model="dataForm.author" placeholder="资讯作者"   type="text" clearable :show-word-limit="true">
                    </el-input><!--maxlength="50"-->
                  </el-form-item>

                </el-col>
                 <el-col  :span="8">
                  <el-form-item label="资讯封面" prop="newsLogo" >

                   <div ><!--errorRange="20"  :width="currIndex>0?twoImgWidth:oneImgWidth" :height="currIndex>0?twoImgHight:oneImgHight" -->
                    <cb-upload type="6" name='newsLogo' :dataForm="dataForm"  placeholder="上传Logo"></cb-upload>
                  </div>
                    <div ><el-tag size="mini" type="danger" effect="plain">尺寸大小 {{currIndex>0?twoImgWidth:oneImgWidth}}*{{currIndex>0?twoImgHight:oneImgHight}} 最佳</el-tag></div>

                  </el-form-item>
                </el-col>



        </el-row>
        <el-row>
          <el-col  :span="24">
                  <el-form-item label="资讯正文" prop="content" >

                    <cb-editor id="content" name="content" :dataForm="dataForm" :height="height"></cb-editor>

                  </el-form-item>
                </el-col>
        </el-row>

        <el-row  class="elDeptFormButton" v-if="!isNotEdit">
          <!-- 操作按钮-->
          <el-col :span="24">
            <el-button size="mini" type="primary" icon="el-icon-circle-close" @click="handleCancel" >
              <!--{{ $t('action.cancel') }}-->
              返回
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="submitForm" :loading="saveLoading">
              {{ $t('action.saveAsDraft') }}
            </el-button>
             <el-button size="mini" type="primary" icon="el-icon-upload" @click="submitForm('release')" :loading="releaseLoading">
              {{ $t('action.release') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>

    </el-container>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "@/utils/global";
import CbEditor from "@/components/cbeditor/index";
import CbUpload from "@/components/cbupload/index";

export default {
    name:'NewsEdit',
    components:{
      CbTable,
      CbButton,
       CbUpload,
      CbEditor,
    },
    data() {
      var validateNewsName=(rule, value, callback) => {
       value=$.trim(value);
        if (!value) {
          return callback(new Error('资讯标题不能为空'));
        }else{
          callback();
        }
      };
      var validateNewsContent=(rule, value, callback) => {
       value=$.trim(value);
        if (!value) {
          return callback(new Error('资讯正文不能为空'));
        }else{
          callback();
        }
      };
      return {
        height:'280', // 富文本高度
        size: "small",//表单大小
        isNotEdit:false,//是否不是编辑状态
        dataForm:{},//表单数据
        leftInfo:[],//左边 数组 数据
        currIndex:-1,//当前选中进行编辑的 数据 下标，-1代表 此时未选中
        dataFormInit:{
          newsId:'',//资讯id
          newTitle:'',//资讯标题
          author:'创蓝信息',//资讯作者
          content:'',//资讯正文
          officialLinkType:'',
          newsLogo:'',//资讯封面
          newsLogoAttachId: '',
        },// 单个表单 初始 数据
        preHoverInfo:{
          isShow:false,//弹窗是否显示
          isClickDel:false
        }, // 悬浮的 上移、下移、删除等按钮的信息
        oneImgWidth:306,//父级（一级） 图片的宽度
        oneImgHight:130,//父级（一级） 图片的高度
        twoImgWidth:48,//子级（二级） 图片的宽度
        twoImgHight:48,//子级（二级） 图片的高度
        dataRule: {
          newTitle: [{ validator: validateNewsName,required: true, message: "资讯标题不能为空", trigger: ["blur","change"] }],
          officialLinkType: [{ required: true, message: "资讯分类不能为空", trigger: ["blur","change"] }],
          newsLogo: [{ required: true, message: "资讯logo不能为空", trigger: "blur" }],
          content: [{ validator: validateNewsContent,required: true, message: "资讯正文不能为空", trigger: ["blur","change"] }],
        },//表单提交规则
        saveLoading: false, // 保存时按钮是否 loading
        releaseLoading: false, // 发布时按钮是否 loading
      }
    },
    watch: {
      'datasWatchProp':{
        handler: function(newVal,oldVal){
          if (newVal.currIndex >= 0) {
            let info = { ...newVal.dataForm };
            if (info.newsLogo && (info.newsLogo).indexOf('://') < 0) {
              let prefix = baseUrl;
              if ((info.newsLogo).indexOf('/uploads/') < 0) {
                prefix = prefix + '/uploads/news-img/';
              }
              info.newsLogo = prefix + info.newsLogo;
            }
            this.leftInfo[newVal.currIndex] = info;
            this.$forceUpdate();
          }
        },
        deep:true,
        immediate: true
      }
    },
    computed:{
      datasWatchProp: function(){
        const {dataForm,currIndex} = this
        return {
          dataForm,
          currIndex,
        }
      }
    },
    mounted() {
      let newsId = this.$route.query.newsId;//'471c0da648a04fe0af5e4f2462feeee9'
      this.initData(newsId);
    },
    methods: {
      // 点击上移 或者 下移 按钮
      toClickMoveBtn(type){
        this.showOrHidePreHoverPopu();
        if (type == 'up') { // 上移
          let currItem = { ...this.leftInfo[this.currIndex] };
          let lastItem = { ...this.leftInfo[this.currIndex -1] };
          this.leftInfo[this.currIndex] = lastItem;
          this.leftInfo[this.currIndex - 1] = currItem;
          // 选中当前 ，更改下标
          this.handleClick(this.currIndex - 1);
        } else if (type == 'dowm') { // 下移
          let currItem = { ...this.leftInfo[this.currIndex] };
          let nextItem = { ...this.leftInfo[this.currIndex +1] };
          this.leftInfo[this.currIndex] = nextItem;
          this.leftInfo[this.currIndex + 1] = currItem;
           // 选中当前 ，更改下标
          this.handleClick(this.currIndex + 1);
        }
      },
      // 监听   移入事件
      handleMouseEnter(index,event){
        if (this.currIndex == index) { // 是当前选中项
          if (this.leftInfo.length > 1) {//当只有一条数据时没有弹窗
            this.showOrHidePreHoverPopu(event,'show');
          }
        }
        // this.$forceUpdate();
      },
      // 点击删除 按钮 弹出  确认 框
      toClickDelBtn(){
        this.preHoverInfo.isClickDel = true;
        // this.$forceUpdate();
      },
      // 进行 删除
      handleDel(){
        // 关闭弹窗
        this.showOrHidePreHoverPopu();
        // 关闭确定弹出
        this.preHoverInfo.isClickDel = false;
        let newIndex = parseInt(JSON.parse(JSON.stringify(this.currIndex)));

        this.leftInfo.splice(this.currIndex,1);

        if (newIndex == 0) { // 如果是第一个 则 选中后一个
          newIndex = newIndex + 1;
        } else { // 选中前一个
          newIndex = newIndex - 1;
        }
        // 更改下标
        this.handleClick(newIndex);

        // this.$forceUpdate();
      },
      // 显示 或者 隐藏 弹窗
      showOrHidePreHoverPopu(event,type){
        if (type == 'show') { // 显示
          if(!this.preHoverInfo.isShow) {
            this.preHoverInfo.isClickDel = false;
            this.preHoverInfo.isShow = true;
            let preHoverRef = this.$refs.preHoverRef;
            this.$nextTick(()=>{ // 定义 位置
              preHoverRef.popperJS._reference = event.target;
              // preHoverRef.popperJS.state.position = preHoverRef.popperJS._setPosition( preHoverRef.popperJS._popper, preHoverRef.popperJS._reference);
              preHoverRef.popperJS.update();

              preHoverRef.updatePopper(); //重选计算
            });
            // this.$refs.preHoverRef.doShow();

          }
        } else {
          this.preHoverInfo.isShow = false;
          this.preHoverInfo.isClickDel = false;
        }


        // if(!this.preHoverInfo.isShow) {
        //   this.preHoverInfo.isClickDel = false;
        // }

        // this.preHoverInfo.isShow = false;

        // if (type == 'show') { // 显示
        //   this.preHoverInfo.isShow = true;
        //   let preHoverRef = this.$refs.preHoverRef;
        //   this.$nextTick(()=>{ // 定义 位置
        //     preHoverRef.popperJS._reference = event.target;
        //     // preHoverRef.popperJS.state.position = preHoverRef.popperJS._setPosition( preHoverRef.popperJS._popper, preHoverRef.popperJS._reference);
        //     preHoverRef.popperJS.update();
        //   });
        //   // this.$refs.preHoverRef.doShow();
        // } else {
        //   this.preHoverInfo.isClickDel = false;
        // }
      },
      //  资讯 具体项 数据 点击事件
      handleClick(index,event){
        this.dataForm = { ...this.leftInfo[index] };
        if (!this.dataForm.content || this.dataForm.content == null) {
          tinyMCE.editors['content'].setContent(''); // 富文本
        }
        if (index > 0) {
          this.dataForm.officialLinkType = this.leftInfo[0].officialLinkType;
        }
        this.currIndex = index;
        if (event && event != null && event != undefined) {
          this.preHoverInfo.isShow = false;
          this.preHoverInfo.isClickDel = false;
          // 显示弹窗，有时候位置不对
          // setTimeout(()=>{
          //   this.showOrHidePreHoverPopu(event,'show');
          // },100)
        }

      },
      // 添加消息，添加子项
      toAddNews(){
        this.$refs["dataForm"].validate( (valid) => {
          if (valid) {
            this.leftInfo.push( JSON.parse(JSON.stringify(this.dataFormInit)) );

            this.handleClick(this.leftInfo.length - 1);
          }
        })

      },
      // 初始化 数据
      initData(newsId) {
        this.leftInfo = [];

        if (!newsId) { // 新增
        this.leftInfo.push(JSON.parse(JSON.stringify(this.dataFormInit)))
        // 选中第一个 父元素
        this.handleClick(0);
          // this.leftInfo = JSON.parse(JSON.stringify(this.dataFormInit));
          // // 选中第一个 父元素
          // this.handleClick();
        } else { // 修改
          this.$api.wxMaterial.viewForOfficial(newsId).then((res) => {
            if (res.code == 0){
              this.handleUpdateData(res);
            }
          });
        }
      },
      // 处理接口返回的 数据
      handleUpdateData(res){
        this.leftInfo = [];
        if (res.data && res.data.newsid) {
          this.leftInfo.push(res.data);
          if (res.data.children && res.data.children.length > 0) {
            (res.data.children).forEach((ele) => {
              if (ele.newsLogo && (ele.newsLogo).indexOf('://') < 0) {
                ele.newsLogo = baseUrl + ele.newsLogo;
              }
              ele.newsLogoAttachId = '';// 附件关联ID
              this.leftInfo.push(ele);
            });
          }
          if (this.leftInfo[0].newsLogo && (this.leftInfo[0].newsLogo).indexOf('://') < 0) {
            this.leftInfo[0].newsLogo = baseUrl + this.leftInfo[0].newsLogo;
          }
          this.leftInfo[0].newsLogoAttachId = '';// 附件关联ID
          this.leftInfo[0].children = [];
          // 选中第一个 父元素
          this.handleClick(0);
        }
      },
      // 表单提交
      submitForm(saveType) {
        this.$refs["dataForm"].validate( (valid) => {
          if (valid) {
            // if (this.isNotEdit) { // 修改的时候  图片处理
            //   if (this.dataForm.newsLogo != null && this.dataForm.newsLogo != ""){
            //     let arr = this.dataForm.newsLogo.split("/");
            //     if (arr.length > 1){
            //       this.dataForm.newsLogo = arr[arr.length-1];
            //     }
            //   }
            // }
            let arr = [ ...this.leftInfo ];
            let params = Object.assign({}, arr[0]);
            params.children = [];
            if (arr.length > 1) {
              arr.forEach((ele,index) => {
                if (index > 0) {
                  params.children.push(ele);
                }
              });
            }

            // let params = Object.assign({}, this.dataForm);

            this.$confirm("确认提交吗？", "提示", { closeOnClickModal:false, type: "warning" }).then(() => {
              this.saveLoading = true;
               params.status = '1'; // 保存
              if ( saveType && saveType == 'release') {
                params.status = '2'; // 发布
              }

              this.$api.wxMaterial.saveForOfficial(params).then(res => {
                this.saveLoading = false;
                if (res.code === 0) {
                  this.$message({ message: "保存成功", type: "success" });
                  //成功后刷新
                  if ( saveType && saveType == 'release') { // 发布 成功后返回列表
                    this.$refs["dataForm"].resetFields();
                    // this.$route.go(-1);
                    this.$router.push("/modules/wechat/news");
                  } else {
                    this.handleUpdateData(res);
                  }
                  // this.$router.push("/modules/wechat/news");
                } else {
                  // this.$message.error('保存失败, ' +res.msg);
                  this.$message.error(res.msg);
                  return;
                }
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          }
        });
      },
       //表单取消
      handleCancel: function(){
        /*$(".el-form-item__error").css("display","none");*/
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.$router.push("/modules/wechat/news");
      },
    },

  }
</script>

<style scoped>
.leftWrap{
  width: fit-content !important;
}
.pre-first-wrap,
.pre-two-img-wrap{
  background-color: #e1e1e1;
}
.pre-first-wrap{
  /* width: 306px; */
  height: 130px;
  position: relative;
}
.pre-first-img-wrap,
.pre-first-img,
.pre-two-img{
  width: 100%;
  height: 100%;
}
.pre-first-img-wrap::before{
  content: '';
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0);
  background-image: linear-gradient(-180deg,rgba(0,0,0,0) 0,rgba(0,0,0,0.15) 86%);
}
.pre-first-label{
  color: #fff;
  position: absolute;
  left: 15px;
    right: 15px;
    bottom: 15px;
    font-weight: 400;
    /* z-index: 1; */

  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
   text-overflow:ellipsis; */
}
.pre-two-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  box-sizing: border-box;
  position: relative;
}
.pre-two-wrap:not(:nth-child(2))::before {
    content: " ";
    position: absolute;
    left: 15px;
    right: 78px;
    top: 0;
    height: 1px;
    background-color: #e4e8eb;
}
.pre-two-label{
  flex: 1;
  padding-right: 15px;
  box-sizing: border-box;
}
.pre-active{
  border: 2px solid #07c160;
}
.pre-hover-wrap{
  /* position: absolute;
  left: 100%;
  z-index: 2021;
  background-color: red; */




  display: flex;
  flex-direction: column;
}
.pre-hover-item{
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  position: relative;
}
.pre-hover-item:hover{
  border-radius: 50%;
  background-color: #ededed;
}
.pre-hover-item i{
  font-size: 18px;
}
.pre-hover-item-del{
  width: 34px;
  height: 34px;
}
.pre-hover-item-del-confirm-wrap{
  position: absolute;
  left: 100%;
  bottom: -15%;
  width: 290px;
  /* width: fit-content; */
  padding-left: 10px;
  /* background-color: red; */
}
.pre-hover-item-del-confirm-inner{
  padding: 10px;
  position: relative;
      box-shadow: 0 1px 20px 0 rgb(0 0 0 / 10%);
    border-radius: 2px;
}
.pre-hover-item-del-confirm-inner::after{
  content: '';
  border: 6px solid transparent;
  border-right-color: #FFF;
  border-left-width: 0;
  position: absolute;
  bottom: -6px;
  left: -6px;
  top: 39%;
  width: 0;
  height: 0;
}
.pre-hover-item-del-confirm{
 text-align: right;
 margin: 0;
}
.pre-add{
  color: #9a9a9a;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.pre-add::before{
  content: " ";
    position: absolute;
    left: 15px;
    right: 15px;
    top: 0;
    height: 1px;
    background-color: #e4e8eb;
}
.pre-add i {
  margin-right: 5px;
}
.right-label-span{
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 20px;
}



/*
保存按钮固定到底部 样式
position: fixed;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
    border-top: 1px solid #d9dadc;
    z-index: 118;
    border-top-width: 0;
    box-shadow: 0 -1px 4px 0 rgb(0 0 0 / 5%);
 */



</style>
