<script setup>

const props = defineProps(["links"]);
const route = useRoute();

const localePath = useLocalePath();
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex">
    <ol class="flex items-center space-x-4" role="list">
      <li v-for="(item, index) of props.links" :key="index">
        <div class="flex items-center">
          <p
              v-if="index !== 0"
              class="text-inner_head">
            /
          </p>
          <NuxtLink
              :aria-current="route.fullPath === localePath(item.link) ? 'page' : undefined"
              :class="{ '!ml-0' : index === 0 }"
              :to="localePath(item.link)"
              class="ml-4 text-sm text-inner_head uppercase">
            {{ item.title }}
          </NuxtLink>
        </div>
      </li>
    </ol>
  </nav>
</template>

