<script setup>
import DefaultTheme from 'vitepress/theme'
import DocEnhance from './components/DocEnhance.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <DocEnhance />
    </template>
  </Layout>
</template>
