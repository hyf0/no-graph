<template>
  <Controller />
</template>

<script lang="ts">
import { defineComponent, onMounted, createApp, watchEffect } from 'vue'
import Controller from './pages/Controller/index.vue'
import D2Graph from './pages/D2Graph/index.vue'
import { isShowGraphViewS } from './state'

export default defineComponent({
  name: 'App',
  components: {
    Controller,
  },
  setup() {
    onMounted(() => {
      const panel = document.querySelector('.notion-frame')! as HTMLDivElement
      if (getComputedStyle(panel).position === 'static') {
        panel.style.position = 'relative'
      }
      const container = document.createElement('div')
      Object.assign(container.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        zIndex: '1000',
      })
      panel.append(container)
      watchEffect((onInvlidate) => {
        isShowGraphViewS.value
        const app = createApp(D2Graph)
        let mounted = false
        if (isShowGraphViewS.value) {
          mounted = true
          app.mount(container)
        }
        onInvlidate(() => {
          if (mounted) {
            app.unmount()
            if (__DEV__) {
              console.log('unmount')
            }
          }
        })
      })
    })
  },
})
</script>

<style scoped>
#no-graph {
  height: 100%;
  width: 100%;
}
</style>
