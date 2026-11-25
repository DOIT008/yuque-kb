import { nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import 'katex/dist/katex.min.css'
import './custom.css'

function renderOnInit(cb) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', cb, { once: true })
  } else {
    cb()
  }
}

function enhanceBlocks() {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return

  // 超长代码块默认折叠（VitePress 已原生显示语言标签，无需重复添加）
  doc.querySelectorAll('pre').forEach(pre => {
    if (pre.dataset.foldDone) return
    pre.dataset.foldDone = '1'
    if (pre.scrollHeight <= 520) return
    const wrapper = pre.parentElement
    if (!wrapper) return
    wrapper.classList.add('code-collapsible', 'is-collapsed')
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'code-toggle'
    btn.textContent = '展开代码'
    btn.addEventListener('click', () => {
      const collapsed = wrapper.classList.toggle('is-collapsed')
      btn.textContent = collapsed ? '展开代码' : '收起代码'
    })
    wrapper.appendChild(btn)
  })

  // 本页结构 details 化：把 info 容器标题改成可点击摘要
  doc.querySelectorAll('.info.custom-block').forEach(block => {
    if (block.dataset.tocDone) return
    block.dataset.tocDone = '1'
    const title = block.querySelector('.custom-block-title')
    if (!title || !/本页结构/.test(title.textContent)) return
    block.classList.add('toc-collapsible')
  })
}

function setupImageZoom() {
  if (window.__yuqueImageZoom) return
  window.__yuqueImageZoom = true

  const overlay = document.createElement('div')
  overlay.className = 'image-zoom-overlay'
  overlay.innerHTML = '<img alt="图片预览" />'
  overlay.addEventListener('click', () => overlay.classList.remove('is-open'))
  document.body.appendChild(overlay)
  const img = overlay.querySelector('img')

  document.addEventListener('click', event => {
    const target = event.target
    if (!(target instanceof HTMLImageElement)) return
    if (!target.closest('.vp-doc')) return
    if (target.classList.contains('image-zoom-overlay-img')) return
    img.src = target.src
    img.className = 'image-zoom-overlay-img'
    overlay.classList.add('is-open')
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') overlay.classList.remove('is-open')
  })
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    const playEnter = () => {
      nextTick(() => {
        const main = document.querySelector('.VPDoc')
        if (!main) return
        main.classList.remove('page-enter')
        void main.offsetWidth
        main.classList.add('page-enter')
        enhanceBlocks()
      })
    }

    router.onAfterRouteChange = playEnter
    renderOnInit(() => {
      setupImageZoom()
      playEnter()
      window.addEventListener('load', enhanceBlocks, { once: true })
    })
  },
}
