<script setup>
import DefaultTheme from 'vitepress/theme'
import DocEnhance from './components/DocEnhance.vue'
import FontPicker from './components/FontPicker.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <FontPicker />
    </template>
    <template #doc-before>
      <DocEnhance />
    </template>
  </Layout>
</template>
