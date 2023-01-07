<template>
  <h1>postId: {{ postId }}</h1>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const postId = route.params['id'];
</script>
