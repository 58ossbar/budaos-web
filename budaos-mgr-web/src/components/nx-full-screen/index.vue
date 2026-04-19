<template>

    <div>
      <i class="fa fa-arrows-alt" @click='click'></i>
    </div>

</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'screenfull',
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
</style>
