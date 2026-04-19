<template>
  <el-button
    v-if="hasPerms(perms)"
    :size="size"
    :type="type"
    :icon="icon"
    :loading="loading"
    @click.stop="stopClick"> <!-- @click="handleClick"  :disabled="!hasPerms(perms)"-->
    {{ label }}
  </el-button>
</template>
<!--:disabled="!hasPerms(perms)"-->
<script>
import {hasPermission} from '@/permission/index.js'

export default {
  name: 'CbButton',
  props: {
    // 按钮显示文本
    label: {
      type: String,
      default: '' /* Button*/
    },
    // 按钮显示图标
    icon: {
      type: String,
      default: ''
    },
    // 按钮尺寸
    size: {
      type: String,
      default: 'mini'
    },
    // 按钮类型
    type: {
      type: String,
      default: null
    },
    // 按钮加载标识
    loading: {
      type: Boolean,
      default: false
    },
    // 按钮是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 按钮权限标识，外部使用者传入
    perms: {
      type: [String, Array],
      default: null
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    handleClick: function() {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    stopClick: function(event) {
      // 按钮操作处理函数
      this.$emit('click', event)
    },
    hasPerms: function(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    }
  }
}
</script>

<style scoped>

</style>
