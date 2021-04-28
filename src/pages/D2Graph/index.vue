<template>
  <div class="basic-layout">
    <div class="view-controller">
      <a
        href="https://github.com/iheyunfei/no-graph/issues"
        title="looking forward to your suggstions"
        target="_blank"
        >Feedback</a
      >
      <span>
        theme:
        <select v-model="viewOptions.theme">
          <option v-for="item in THEMES" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </span>
      <span
        >showLabel: <input type="checkbox" v-model="viewOptions.label.show"
      /></span>
      <button @click="clearCache">clear cache</button>
    </div>
    <div class="container">
      <div id="char">
        <VChart
          v-if="isShowGraphViewS"
          :theme="viewOptions.theme"
          @graphRoam="handleGraphRoam"
          @click="handleClick"
          :loading="isLoading"
          :option="option"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { use } from 'echarts/core'
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  VisualMapComponent,
  DataZoomComponent,
  TimelineComponent,
  CalendarComponent,
} from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import * as napi from '@/api'
// @ts-ignore
window.n = napi
use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  VisualMapComponent,
  DataZoomComponent,
  TimelineComponent,
  CalendarComponent,
])
import VChart from 'vue-echarts'
import { GNode } from '@/models'
import { THEMES } from '@/constants'
import { isShowGraphViewS } from '@/state'

export default defineComponent({
  name: 'D3Graph',
  components: {
    VChart,
  },
  methods: {
    handleClick(prop: any) {
      if (__DEV__) {
        console.log(GNode.nodes[prop.data.id])
      }
    },
    handleGraphRoam(evt: { zoom?: number }) {
      // TODO: font-size zomming
    },
  },
  nodes: [] as any[],
  setup() {
    const viewOptions = reactive({
      theme: 'auto' as 'auto' | 'dark' | 'light',
      label: {
        fontSize: 12,
        show: true,
      },
    })

    const types = GNode.types.slice().filter(t => t !== 'Unkown')

    const serie = reactive({
      name: 'Les Miserables',
      edgeSymbol: ['none', 'arrow'],
      draggable: true,
      label: viewOptions.label,
      type: 'graph',
      layout: 'force',
      data: [] as any[],
      edges: [] as any[],
      categories: types.map((t) => ({
        name: t,
        keyword: {},
        base: t,
      })),
      roam: true,
      // label: {
      //   position: 'right',
      //   formatter: '{b}',
      // },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10,
        },
      },
      force: {
        repulsion: 500,
      },
    })
    const option = ref({
      legend: {
        data: [...types],
      },
      series: [serie],
    })
    const isLoading = ref(false)

    const clearCache = () => {
      napi.cacheStore.clear()
      window.alert('success, please reload the page')
    }

    return {
      option,
      isLoading,
      serie,
      THEMES,
      viewOptions,
      isShowGraphViewS,
      clearCache,
    }
  },
  async mounted() {
    this.isLoading = true
    try {
      await napi.makeWorld()
      this.serie.data = Object.values(GNode.nodes)
        .filter((n) => n.type !== 'Unkown')
        .map((n) => ({
          id: n.opts.id,
          name: n.name,
          value: n.name,
          category: n.type,
          symbolSize: n.size,
        }))

      this.serie.edges = Object.values(GNode.nodes)
        .map((n) => {
          if (!n.source.parent_id) return
          let parentId: string | undefined = n.source.parent_id
          while (parentId) {
            const parent = GNode.nodes[parentId]
            if (parent == null) return null
            if (
              parent.opts.type === 'Page' ||
              parent.opts.type === 'Space' ||
              parent.opts.type === 'CollectionViewPage'
            ) {
              return {
                source: parentId,
                target: n.opts.id,
              }
            }
            parentId = parent.source.parent_id
          }
          return null
        })
        .filter((n) => n != null)
    } catch (err) {
      console.log('err', err)
    } finally {
      this.isLoading = false
    }
  },
})
</script>

<style>
.view-controller {
  padding: 2px 14px;
  display: flex;
  align-items: center;
}
.view-controller > * {
  margin-right: 4px;
}
#char {
  width: 100%;
  height: 100%;
}

.basic-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #fff;
}
.container {
  flex: 1;
}
</style>
