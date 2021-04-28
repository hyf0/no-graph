<template>
  <div class="controller">
    <label>Graph <input v-model="isShowGraphViewS" type="checkbox" /></label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isShowGraphViewS } from '@/state'

export default defineComponent({
  name: 'D2Graph',
  setup() {
   return {
    isShowGraphViewS,
   }
  },
})
</script>

<style>
.controller {
  padding: 2px 18px;
  display: flex;
  align-items: center;
}
</style>
