import { nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

function renderOnInit(cb) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', cb, { once: true })
  } else {
    cb()
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    const playEnter = () => {
      nextTick(() => {
        const main = document.querySelector('.VPDoc')
        if (!main) return
        main.classList.remove('page-enter')
        void main.offsetWidth
        main.classList.add('page-enter')
      })
    }

    router.onAfterRouteChange = playEnter
    renderOnInit(playEnter)
  },
}
