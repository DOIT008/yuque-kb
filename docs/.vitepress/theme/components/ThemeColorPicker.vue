<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 主题色选项。key 对应 html[data-theme]，custom.css 里定义各套变量。
const THEMES = [
  { key: 'green', label: 'Vue 绿', color: '#42b883' },
  { key: 'blue', label: '科技蓝', color: '#3b82f6' },
  { key: 'purple', label: '紫罗兰', color: '#8b5cf6' },
  { key: 'orange', label: '暖橙', color: '#f59e0b' },
  { key: 'cyan', label: '青碧', color: '#06b6d4' }
]

const STORAGE_KEY = 'kb-theme'

const current = ref('green')
const open = ref(false)
const root = ref(null)

const currentTheme = computed(() => THEMES.find(t => t.key === current.value) || THEMES[0])

function apply(key) {
  const html = document.documentElement
  if (key === 'green') html.removeAttribute('data-theme')
  else html.setAttribute('data-theme', key)
  try { localStorage.setItem(STORAGE_KEY, key) } catch (e) {}
  current.value = key
  open.value = false
}

function onDocClick(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}
function onKeydown(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  let saved = 'green'
  try { saved = localStorage.getItem(STORAGE_KEY) || 'green' } catch (e) {}
  current.value = THEMES.some(t => t.key === saved) ? saved : 'green'
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="theme-picker" ref="root">
    <button
      class="theme-picker-btn"
      type="button"
      :aria-label="'主题色：' + currentTheme.label"
      :title="'主题色：' + currentTheme.label"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <span class="theme-picker-dot" :style="{ background: currentTheme.color }"></span>
    </button>

    <Transition name="theme-picker-fade">
      <div class="theme-picker-menu" v-if="open" role="menu">
        <div class="theme-picker-head">选择主题色</div>
        <div class="theme-picker-grid">
          <button
            v-for="t in THEMES"
            :key="t.key"
            class="theme-picker-swatch"
            :class="{ active: current === t.key }"
            type="button"
            role="menuitem"
            :title="t.label"
            @click="apply(t.key)"
          >
            <span class="theme-picker-chip" :style="{ background: t.color }">
              <span v-if="current === t.key" class="theme-picker-check">✓</span>
            </span>
            <span class="theme-picker-label">{{ t.label }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* ===== 导航栏主题色按钮 ===== */
.theme-picker {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}
/* 桌面端：把主题色圆点排到主题切换(☀)旁、社交图标之前，
   让「主题切换 + 主题色」成为一组；与两侧留出呼吸空间，
   并在圆点右侧画一条竖线分隔社交图标 */
@media (min-width: 960px) {
  html:root .theme-picker {
    order: 1;
    margin: 0 14px 0 6px;
  }
  html:root .VPNavBar .social-links { order: 2; }
  /* 禁用 VitePress 挂在 appearance+social-links 之间的旧竖线 */
  html:root .VPNavBar .appearance + .social-links::before {
    display: none;
  }
  /* 在主题色圆点右侧画新的分隔竖线 */
  html:root .theme-picker::after {
    content: '';
    position: absolute;
    right: -9px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 22px;
    background-color: var(--vp-c-divider);
  }
}
.theme-picker-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}
.theme-picker-btn:hover,
.theme-picker-btn[aria-expanded='true'] {
  border-color: var(--vp-c-brand-1);
  transform: scale(1.06);
}
.theme-picker-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition: background 0.3s;
}

/* ===== 下拉色卡 ===== */
.theme-picker-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 100;
  width: 200px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08);
}
.theme-picker-head {
  padding: 4px 8px 8px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 6px;
}
.theme-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.theme-picker-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 2px 6px;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.theme-picker-swatch:hover { background: var(--vp-c-bg-soft); }
.theme-picker-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.theme-picker-swatch.active .theme-picker-chip {
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px var(--vp-c-brand-1);
}
.theme-picker-check {
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}
.theme-picker-label {
  color: var(--vp-c-text-2);
  font-size: 10px;
  white-space: nowrap;
}
.theme-picker-fade-enter-active,
.theme-picker-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.theme-picker-fade-enter-from,
.theme-picker-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
