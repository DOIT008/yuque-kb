<script setup>
import DefaultTheme from 'vitepress/theme'
import DocEnhance from './components/DocEnhance.vue'
import ThemeColorPicker from './components/ThemeColorPicker.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <ThemeColorPicker />
    </template>
    <template #doc-before>
      <DocEnhance />
    </template>
  </Layout>
</template>
