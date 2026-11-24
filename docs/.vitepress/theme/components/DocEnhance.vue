<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const { page, frontmatter, theme } = useData()
const route = useRoute()

const bookNames = {
  '工作': '工作',
  '生活': '生活',
  'Python': 'Python',
  '前端': '前端',
  '开源': '开源'
}

// 分组链接不能指向目录根（那里没有 index.md 会 404），改用该分组在 sidebar 里的第一篇文档。
function groupLink(slug, rawSlug) {
  const cfg = theme.value || {}
  const sidebar = Array.isArray(cfg.sidebar) ? cfg.sidebar : []
  for (const group of sidebar) {
    if (!group || !Array.isArray(group.items)) continue
    const isTarget = group.text === slug || group.link === '/' + slug + '/' || group.link === '/' + rawSlug + '/'
    if (!isTarget) continue
    for (const item of group.items) {
      if (item && item.link) return item.link
    }
    if (group.link) return group.link
  }
  const nav = Array.isArray(cfg.nav) ? cfg.nav : []
  const hit = nav.find((n) => n && n.text === slug && n.link)
  if (hit) return hit.link
  return '/' + rawSlug + '/'
}

const crumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const list = [{ text: '首页', link: withBase('/') }]
  if (parts.length >= 2) {
    const rawSlug = parts[1]
    let slug = rawSlug
    try { slug = decodeURIComponent(rawSlug) } catch { /* 非法转义时保持原值 */ }
    list.push({ text: bookNames[slug] || slug, link: withBase(groupLink(slug, rawSlug)) })
  }
  list.push({ text: page.value.title || '文档' })
  return list
})

const showBreadcrumb = computed(() => frontmatter.value.layout !== 'home')

const progress = ref(0)
let raf = 0

function updateProgress() {
  const doc = document.querySelector('.VPDoc')
  if (!doc) return
  const rect = doc.getBoundingClientRect()
  const scrollable = doc.scrollHeight - window.innerHeight
  const passed = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 1))
  const scrollRatio = scrollable > 40 ? (passed / scrollable) * 100 : 100
  const heading = doc.querySelector('.vp-doc h1')
  const titleRatio = heading
    ? Math.min(Math.max((60 - heading.getBoundingClientRect().top) / 60, 0), 1) * 100
    : 100
  progress.value = Math.round(Math.max(titleRatio, scrollRatio))
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    updateProgress()
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  requestAnimationFrame(updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

watch(() => route.path, () => requestAnimationFrame(updateProgress))
</script>

<template>
  <div v-if="showBreadcrumb" class="doc-enhance">
    <div class="reading-progress" role="presentation">
      <span :style="{ width: progress + '%' }" />
    </div>
    <nav class="breadcrumb" aria-label="面包屑">
      <template v-for="(item, i) in crumbs" :key="i">
        <span v-if="i > 0" class="breadcrumb-sep">/</span>
        <a v-if="item.link && i < crumbs.length - 1" :href="item.link">{{ item.text }}</a>
        <span v-else class="breadcrumb-current">{{ item.text }}</span>
      </template>
    </nav>
  </div>
</template>
