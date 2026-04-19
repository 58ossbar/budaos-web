/*
 * 接口统一集成模块
 */
/*
 * 接口统一集成模块，导出的变量名，约束为驼峰命名风格
 */
// 登录
import * as login from './modules/sys/login'
// 系统设置
import * as settings from './modules/sys/settings'
// 机构管理
import * as dept from './modules/sys/dept'
// 用户管理
import * as user from './modules/sys/user'
// 角色管理
import * as role from './modules/sys/role'
// 岗位管理
import * as post from './modules/sys/post'
// 字典管理
import * as dict from './modules/sys/dict'
// 登录日志
import * as loginLog from './modules/sys/login-log'
// 菜单管理
import * as menu from './modules/sys/menu'
// 定时任务
import * as job from './modules/sys/job'
// 附件管理
import * as attach from './modules/sys/attach'
// 参数管理
import * as parameter from './modules/sys/parameter'
// 操作日志
import * as log from './modules/sys/log'
// 流水号
import * as serialno from './modules/sys/serialno'

import * as tevglsiteresourceext from './moudules/site/TevglSiteResourceext' // 站点栏目
import * as tevglsiteavd from './moudules/site/TevglSiteAvd' // 栏目图片:轮播图等
import * as tevglsitenews from './moudules/site/TevglSiteNews' // 新闻资讯
import * as tevglsitepartner from './moudules/site/TevglSitePartner' // 合作企业
import * as tevglstustar from './moudules/site/TevglStuStar' // 实训故事
import * as tevgltchteacher from './moudules/res/TevglTchTeacher' // 布道师
import * as tevglbookmajor from './moudules/res/TevglBookMajor' // 职业课程路径
import * as tevglbooksubject from './moudules/res/TevglBookSubject' // 课程
import * as tevglbooksubperiod from './moudules/res/TevglBookSubperiod' // 课程
import * as tevgltchclass from './moudules/res/TevglTchClass' // 班级
import * as tevgltraineeinfo from './moudules/res/TevglTraineeInfo' // 学员
import * as tevgltchclassroom from './moudules/res/TevglTchClassroom' // 课堂
import * as tmedumediaavd from './moudules/medu/TmeduMediaAvd' // 布道师小程序广告轮播
import * as tevglsitefeedback from './moudules/site/TevglSiteFeedback' // 意见反馈
import * as tevglsitefeedbackreply from './moudules/site/TevglSiteFeedbackReply' // 意见反馈回复
import * as tevglsiteupdatelog from './moudules/site/TevglSiteUpdateLog' // 更新日志
import * as tevgltchclasstrainee from './moudules/res/TevglTchClasstrainee' // 班级学员
import * as tevglbookregular from './moudules/res/TevglBookRegular' // 考核规则
import * as tevglsitejoinus from './moudules/site/TevglSiteJoinUs' // 加入我们
import * as tevglforumfriend from './moudules/site/TevglForumFriend' // 友情社区
import * as tevglforumfriendtype from './moudules/site/TevglForumFriendType' // 友情分类
// 教学包
import * as pkg from './moudules/pkg/pkg'
import * as tevglpkgcheck from './moudules/pkg/TevglPkgCheck'
// 视频管理
import * as tevglSiteVideo from './moudules/site/TevglSiteVideo'
// 【财务管理】
import * as teaofdorder from './moudules/eao/TeaoFdOrder'
import * as teaofdrefusebill from './moudules/eao/TeaoFdRefusebill'
import * as teaofdtrade from './moudules/eao/TeaoFdTrade'
// 课表编排
import * as tevglTchSchedule from './moudules/res/TevglTchSchedule'
// 课表编排
import * as common from './moudules/common'
// 博客管理
import * as tevglforumblogpost from './moudules/site/TevglForumBlogPost'
// 公众号管理
import * as wxMaterial from './moudules/wx/WxMaterial'

// 默认全部导出
export default {
  login,
  user,
  dept,
  parameter,
  post,
  role,
  menu,
  dict,
  attach,
  settings,
  log,
  serialno,
  loginLog,
  job,
  tevglsiteavd,
  tevglsiteresourceext,
  tevglsitenews,
  tevglsitepartner,
  tevglstustar,
  tevgltchteacher,
  tevglbookmajor,
  tevglbooksubject,
  tevglbooksubperiod,
  tevgltchclass,
  tevgltraineeinfo,
  tevgltchclassroom,
  tmedumediaavd,
  tevglsitefeedback,
  tevglsitefeedbackreply,
  tevglsiteupdatelog,
  tevgltchclasstrainee,
  tevglbookregular,
  tevglsitejoinus,
  tevglforumfriend,
  tevglforumfriendtype,
  tevglpkgcheck,
  tevglSiteVideo,
  teaofdorder,
  teaofdrefusebill,
  teaofdtrade,
  pkg,
  tevglTchSchedule,
  common,
  tevglforumblogpost,
  wxMaterial
}
