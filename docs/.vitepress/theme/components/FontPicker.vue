<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 正文字体选项。stack 留空表示不覆盖，跟随系统默认（VitePress 原生字体栈）。
const FONTS = [
  { key: 'system', label: '系统默认', stack: '', hint: '跟随设备' },
  { key: 'yahei', label: '微软雅黑', stack: '"Microsoft YaHei", "微软雅黑", "PingFang SC", sans-serif', hint: 'Windows' },
  { key: 'pingfang', label: '苹方', stack: '"PingFang SC", "苹方", -apple-system, "Microsoft YaHei", sans-serif', hint: 'macOS / iOS' },
  { key: 'sourcehan', label: '思源黑体', stack: '"Source Han Sans SC", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif', hint: '跨平台' },
  { key: 'serif', label: '宋体', stack: '"Songti SC", "SimSun", "宋体", "Noto Serif CJK SC", serif', hint: '衬线 · 长文' }
]

const STORAGE_KEY = 'kb-font'

const current = ref('system')
const open = ref(false)
const root = ref(null)

const currentLabel = computed(() => FONTS.find(f => f.key === current.value)?.label || '系统默认')

function apply(key) {
  const html = document.documentElement
  if (key === 'system') html.removeAttribute('data-font')
  else html.setAttribute('data-font', key)
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
  // head 前置脚本已经应用过，这里同步一下组件显示状态（兜底）
  let saved = 'system'
  try { saved = localStorage.getItem(STORAGE_KEY) || 'system' } catch (e) {}
  current.value = FONTS.some(f => f.key === saved) ? saved : 'system'
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="font-picker" ref="root">
    <button
      class="font-picker-btn"
      type="button"
      :aria-label="'字体设置：' + currentLabel"
      :title="'字体设置：' + currentLabel"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <span class="font-picker-glyph">Aa</span>
      <span class="font-picker-name">{{ currentLabel }}</span>
    </button>

    <Transition name="font-picker-fade">
      <div class="font-picker-menu" v-if="open" role="menu">
        <div class="font-picker-head">选择正文字体</div>
        <button
          v-for="f in FONTS"
          :key="f.key"
          class="font-picker-item"
          :class="{ active: current === f.key }"
          type="button"
          role="menuitem"
          @click="apply(f.key)"
        >
          <span class="font-picker-preview" :style="{ fontFamily: f.stack || undefined }">{{ f.label }}</span>
          <span class="font-picker-hint">{{ f.hint }}</span>
          <span class="font-picker-check" v-if="current === f.key">✓</span>
        </button>
        <div class="font-picker-foot">偏好会保存在本机</div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* ===== 正文字体切换：data-font 属性覆盖 VitePress 基础字体变量 ===== */
html[data-font='yahei'] {
  --vp-font-family-base: "Microsoft YaHei", "微软雅黑", "PingFang SC", sans-serif;
}
html[data-font='pingfang'] {
  --vp-font-family-base: "PingFang SC", "苹方", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
}
html[data-font='sourcehan'] {
  --vp-font-family-base: "Source Han Sans SC", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif;
}
html[data-font='serif'] {
  --vp-font-family-base: "Songti SC", "SimSun", "宋体", "Noto Serif CJK SC", serif;
}

/* ===== 导航栏字体按钮 ===== */
.font-picker {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}
.font-picker-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.font-picker-btn:hover,
.font-picker-btn[aria-expanded='true'] {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}
.font-picker-glyph {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 15px;
  font-weight: 600;
}
.font-picker-name {
  white-space: nowrap;
}

/* ===== 下拉菜单 ===== */
.font-picker-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 100;
  width: 188px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08);
}
.font-picker-head,
.font-picker-foot {
  padding: 6px 10px;
  color: var(--vp-c-text-3);
  font-size: 11px;
}
.font-picker-head { border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 4px; }
.font-picker-foot { border-top: 1px solid var(--vp-c-divider); margin-top: 4px; }
.font-picker-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.font-picker-item:hover { background: var(--vp-c-bg-soft); }
.font-picker-item.active { background: var(--vp-c-brand-soft); }
.font-picker-preview {
  font-size: 15px;
  font-weight: 500;
}
.font-picker-hint {
  margin-left: auto;
  padding-left: 8px;
  color: var(--vp-c-text-3);
  font-size: 10px;
  white-space: nowrap;
}
.font-picker-check {
  margin-left: 4px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}
.font-picker-fade-enter-active,
.font-picker-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.font-picker-fade-enter-from,
.font-picker-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
  .font-picker-name { display: none; }
  .font-picker-btn { padding: 0 8px; }
}
</style>
