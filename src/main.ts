import { createApp } from 'vue'
import App from './App.vue'

function mountContainer() {
  window.addEventListener('load', () => {
    setTimeout(function polling() {
      const sidebar = document.querySelector('.notion-sidebar') as HTMLDivElement | null
      if (sidebar) {
        const controllerDiv = document.createElement('div')
        createApp(App).mount(controllerDiv)
        sidebar.insertBefore(controllerDiv, sidebar.firstElementChild)
      } else {
        setTimeout(polling, 150)
      }
    }, 150)
  })
}

mountContainer()
