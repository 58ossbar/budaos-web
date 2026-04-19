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
      <!--<el-dialog
        width="30%"
        :title="innerTitle"
        :visible.sync="innerVisible"
        append-to-body>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" @click.native="handleCloseInner">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="saveChapter"  :loading="editLoadingInner">{{$t('action.preservation')}}</el-button>
        </div>
      </el-dialog>-->
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 左侧树形 begin -->
          <div class="tree-area">
            <el-tree ref="tree" node-key="chapterId" :data="nodeList" :props="defaultProps" :default-expanded-keys="defaultExpandedKeys" @node-click="handleNodeClick" @node-contextmenu="nodeContextMenu">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div v-if="!data.edit">
                  <span :id="'span_' + data.chapterId">{{ node.label }}</span>
                  <!--<span>
                    <el-button
                      v-if="data.level <= 2"
                      type="text"
                      size="mini"
                      @click="() => append(data)">
                      添加
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => update(data)">
                      修改
                    </el-button>
                    <el-button
                      v-if="data.level > 0"
                      type="text"
                      size="mini"
                      @click="() => remove(data)">
                      删除
                    </el-button>
                  </span>-->
                </div>
                <div v-else>
                  <!--@blur="() => saveChapter(data)" -->
                  <el-input v-model="data.chapterName" maxlength="50" size="mini" :id="data.chapterId" @keyup.enter.native="saveChapter(data)" />
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => cancel(data)">
                      取消
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => saveChapter(data)">
                      保存
                    </el-button>
                  </span>
                </div>
              </span>
            </el-tree>
          </div>
          <!-- 左侧树形 end -->
        </el-col>
        <el-col :span="16">
          <!-- 右侧富文本 begin -->
          <div class="content-area">
            <div v-show="type == 'subject'"></div>
            <div v-show="type == 'chapter'" class="textAlign">当前章节：<el-tag type="danger" size="mini" effect="dark" style="margin-bottom: 5px;">{{ currentName }}</el-tag></div>
            <cb-editor v-show="type == 'chapter'" ref="chapterContent" id="chapterContent" name="chapterContent" :parent-vue="_self" :data-form="dataForm"  :height="502"></cb-editor>
          </div>
          <!-- 右侧富文本 end -->
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="handleClose">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="saveChapterContent"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbEditor from '../../../components/cbeditor/index'

export default {
  name: 'save-chapter',
  components: {CbEditor},
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
          this.getChapterTree()
          this.defaultExpandedKeys = [this.subjectId]
        }
      }
    }
  },
  data () {
    return {
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
    document.addEventListener('click', this.hideMenu)
  },
  methods: {
    handleClose (evt) {
      this.$emit('close', evt)
      this.type = 'subject'
    },
    handleNodeClick (data) {
      this.hideMenu()
      this.type = data.type
      this.dataForm.chapterId = data.chapterId
      this.currentName = data.chapterName
      if (this.type === 'chapter') {
        this.$api.tevglbooksubject.viewChapter(data.chapterId).then(res => {
          if (res.code === 0) {
            this.dataForm.chapterContent = res.data.chapterContent || ''
            if (this.dataForm.chapterContent) {
              tinyMCE.editors['chapterContent'].setContent(this.dataForm.chapterContent)
            } else {
              tinyMCE.editors['chapterContent'].setContent('')
            }
          }
        })
      }
    },
    getChapterTree () {
      this.$api.tevglbooksubject.getChapterTree({ subjectId: this.subjectId }).then(res => {
        if (res.code === 0) {
          this.nodeList = res.data
        }
      })
    },
    handleCloseInner () {
      this.innerVisible = false
    },
    /**
     * 鼠标右键触发事件
     * @param event
     * @param data
     * @param node
     * @param compent
     */
    nodeContextMenu (event, data, node, compent) {
      // 高亮选中
      this.$refs.tree.setCurrentKey(data.chapterId, node)
      // 存放菜单列表
      const arr = []
      const o1 = {
        name: '新增',
        onClick: () => {
          this.append(data)
        }
      }
      const o2 = {
        name: '修改',
        onClick: () => {
          this.update(data)
        }
      }
      const o3 = {
        name: '删除',
        onClick: () => {
          this.remove(data)
        }
      }
      // 第3级的章节不允许再继续添加子节点
      if (data.level <= 2) {
        arr.push(o1)
      }
      // 非根节点的都允许修改
      if (data.level > 0) {
        arr.push(o2)
        arr.push(o3)
      }
      let options = {
        menus: arr
      }
      this.createMenu(options)
      // 显示右键菜单
      this.showMenu(event)
    },
    /**
     * 创建右键菜单
     */
    createMenu: function (options) {
      const body = document.querySelector('body')
      let ele = document.querySelector('.custom-context-menu')
      if (ele) {
        body.removeChild(ele)
      }
      const ul = document.createElement('ul')
      ul.classList.add('custom-context-menu')
      ul.style.zIndex = '123456'
      const { menus } = options
      if (menus && menus.length > 0) {
        for (let menu of menus) {
          const li = document.createElement('li')
          li.textContent = menu.name
          li.onclick = menu.onClick
          ul.appendChild(li)
        }
      }
      body.appendChild(ul)
      return ul
    },
    /**
     * 显示右键菜单
     */
    showMenu: function (e) {
      e.preventDefault()
      // const menus = this.contextMenu.getInstance();
      const menus = document.querySelector('.custom-context-menu')
      menus.style.top = `${e.clientY}px`
      menus.style.left = `${e.clientX}px`
      menus.classList.remove('hidden')
    },
    /**
     * 隐藏右键菜单
     */
    hideMenu: function () {
      if (this.contextMenu) {
        // const menus = this.contextMenu.getInstance();
      }
      const menus = document.querySelector('.custom-context-menu')
      if (menus) {
        menus.classList.add('hidden')
      }
    },
    /**
     * 添加
     * @param data
     */
    append (data) {
      this.hideMenu()
      let timestamp = new Date().getTime()
      const newChild = { chapterId: 'cb_' + timestamp, parentId: data.chapterId, subjectId: data.subjectId, chapterName: '', children: [], edit: true }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      // 展开父节点
      const findData = this.defaultExpandedKeys.find(item => item == data.chapterId)
      if (!findData) {
        this.defaultExpandedKeys.push(data.chapterId)
      }
      //
      // 聚焦刚添加的节点
      this.$nextTick(() => {
        console.log(data.chapterId)
        const input = document.getElementById(newChild.chapterId)
        console.log(input)
        if (input) {
          input.focus()
        }
      })
    },
    /**
     * 修改
     * @param data
     */
    update (data) {
      this.hideMenu()
      // data.edit = true // 值虽然变了，但视图层不会被影响
      this.$set(data, 'edit', true) // 用这个
      // 去掉序号
      data.chapterNameOld = data.chapterName
      let i = data.chapterName.indexOf(' ')
      if (i !== 0) {
        data.chapterName = data.chapterName.substring(i + 1, data.chapterName.length)
      }
      this.$nextTick(() => {
        const input = document.getElementById(data.chapterId)
        input.focus()
      })
    },
    /**
     * 取消
     * @param data
     */
    cancel (data) {
      if (data.chapterNameOld) {
        data.chapterName = data.chapterNameOld
      }
      this.hideMenu()
      this.$set(data, 'edit', false)
    },
    /**
     * 保存
     * @param data
     */
    saveChapter (data) {
      this.hideMenu()
      this.$set(data, 'edit', false)
      if (!data.chapterName.length) {
        this.getChapterTree()
        return false
      }
      // 标识为修改操作
      if (data.chapterId.indexOf('cb_') !== -1) {
        data.chapterId = ''
      }
      this.$api.tevglbooksubject.saveChapterInfo(data).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.getChapterTree()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    remove (data) {
      this.hideMenu()
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('chapterId', data.chapterId)
        this.$api.tevglbooksubject.remove(formData).then(res => {
          if (res.code === 0) {
            this.$message.success(res.msg)
            this.getChapterTree()
          } else {
            this.$message.warning(res.msg)
          }
        })
      })
    },
    saveChapterContent () {
      this.editLoading = true
      this.$api.tevglbooksubject.saveChapterContent(this.dataForm).then(res => {
        this.editLoading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(() => {
        this.editLoading = false
      })
    }
  }
}
</script>

<style scoped>
.tree-area {
  /*width: 30%;*/
  min-height: 600px;
  max-height: 600px;
  margin: 10px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 3px;
}
.input-chapter-name {
  margin-right: 5px;
  padding-right: 15px;
}
  .content-area {
    padding: 10px;
  }
</style>
