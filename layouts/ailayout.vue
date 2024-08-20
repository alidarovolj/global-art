<script setup>
import {SparklesIcon} from "@heroicons/vue/24/outline"

const localePath = useLocalePath();

const route = useRoute();

const isActive = (link) => {
  const [path, hash] = link.split("#");
  return route.path === path && route.hash === hash;
};
</script>

<template>
  <div>
    <div class="flex items-start gap-10">
      <div class="hidden md:block w-full md:w-1/4 sticky top-10">
        <div
            class="flex flex-col gap-12 text-[#757575] font-bold text-xl ai-links"
        >
          <div
              :class="{ active: isActive('/about-ai/#generating') }"
              class="flex items-center gap-2 hov-icon"
          >
            <SparklesIcon
                class="block text-black  icon w-5 h-5"
            />
            <NuxtLink :to="localePath('/about-ai/#generating')" class="block" prefetch>
              {{ $t("aboutAI.generateFromScratch") }}
            </NuxtLink>
          </div>
          <div
              :class="{ active: isActive('/about-ai/#inspiration') }"
              class="flex items-center gap-2 hov-icon"
          >
            <SparklesIcon
                class="block text-black  icon w-5 h-5"
            />
            <NuxtLink :to="localePath('/about-ai/#inspiration')" class="block" prefetch>
              {{ $t("aboutAI.beInspiredByArtists") }}
            </NuxtLink>
          </div>
          <div
              :class="{ active: isActive('/about-ai/#editing') }"
              class="flex items-center gap-2 hov-icon"
          >
            <SparklesIcon
                class="block text-black  icon w-5 h-5"
            />
            <NuxtLink :to="localePath('/about-ai/#editing')" class="block" prefetch>
              {{ $t("aboutAI.editYourPhotos") }}
            </NuxtLink>
          </div>
          <div
              :class="{ active: isActive('/about-ai/#actions') }"
              class="flex items-center gap-2 hov-icon"
          >
            <SparklesIcon
                class="block text-black  icon w-5 h-5"
            />
            <NuxtLink :to="localePath('/about-ai/#actions')" class="block" prefetch>
              {{ $t("aboutAI.makeArtMove") }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="w-full md:w-3/4">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-links .icon {
  opacity: 0;
  width: 0;
}

.ai-links .hov-icon:hover .icon {
  opacity: 1;
  width: 30px;
}

.ai-links .hov-icon:hover a {
  color: #000;
  font-family: "Playfair Display", sans-serif;
}

.ai-links .hov-icon.active {
  color: #000;
  font-family: "Playfair Display", sans-serif;
}

.ai-links .hov-icon.active .icon {
  opacity: 1;
  width: 30px;
}

.ai-links .active {
  color: #000;
  font-family: "Playfair Display", sans-serif;
}

html.dark .ai-links .icon {
  opacity: 0;
  width: 0;
}

html.dark .ai-links .hov-icon:hover .icon {
  opacity: 1;
  width: 30px;
}

html.dark .ai-links .hov-icon:hover a {
  color: #fff;
  font-family: "Playfair Display", sans-serif;
}

html.dark .ai-links .hov-icon.active {
  color: #fff;
  font-family: "Playfair Display", sans-serif;
}

html.dark .ai-links .hov-icon.active .icon {
  opacity: 1;
  width: 30px;
}

html.dark .ai-links .active {
  color: #fff;
  font-family: "Playfair Display", sans-serif;
}
</style>
