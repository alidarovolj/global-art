<script setup>
import {ArrowLongRightIcon} from '@heroicons/vue/24/outline';

const {t} = useI18n();

const pickedVideo = ref(0);
</script>

<template>
  <div class="mt-28">
    <div class="container mx-auto px-4 md:px-0">
      <h2 class="text-3xl md:text-7xl font-bold mb-10">
        {{ $t("aboutAI.cases") }}:
      </h2>
      <div class="block md:flex justify-between">
        <div
            class="w-full md:w-1/3 flex flex-col gap-3 md:gap-12 text-sm md:text-xl font-semibold mb-7 md:mb-0"
        >
          <div
              :class="{ 'underline italic': pickedVideo === 0 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 0"
          >
            <p>{{ $t("aboutAI.artists") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 0" class="w-5 h-5"/>
          </div>
          <div
              :class="{ 'underline italic': pickedVideo === 1 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 1"
          >
            <p>{{ $t("aboutAI.designers") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 1" class="w-5 h-5"/>
          </div>
          <div
              :class="{ 'underline italic': pickedVideo === 2 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 2"
          >
            <p>{{ $t("aboutAI.eventDesigners") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 2" class="w-5 h-5"/>
          </div>
          <div
              :class="{ 'underline italic': pickedVideo === 3 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 3"
          >
            <p>{{ $t("aboutAI.marketing") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 3" class="w-5 h-5"/>
          </div>
          <div
              :class="{ 'underline italic': pickedVideo === 4 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 4"
          >
            <p>{{ $t("aboutAI.gameDesigners") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 4" class="w-5 h-5"/>
          </div>
          <div
              :class="{ 'underline italic': pickedVideo === 5 }"
              class="flex gap-2 items-center cursor-pointer"
              @click="pickedVideo = 5"
          >
            <p>{{ $t("aboutAI.industrialDesigners") }}</p>
            <ArrowLongRightIcon v-if="pickedVideo === 5" class="w-5 h-5"/>
          </div>
        </div>
        <div class="w-full md:w-2/3">
          <div v-if="pickedVideo === 0">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.artist") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/1.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>

          <div v-if="pickedVideo === 1">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.designers") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/2.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>

          <div v-if="pickedVideo === 2">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.eventDesigners") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/3.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>

          <div v-if="pickedVideo === 3">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.marketing") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/4.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>

          <div v-if="pickedVideo === 4">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.gameDesigners") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/5.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>

          <div v-if="pickedVideo === 5">
            <p class="text-2xl md:text-5xl font-bold mb-4">
              {{ $t("aboutAI.industrialDesigners") }}
            </p>
            <video
                autoplay
                class="w-full h-auto object-cover rounded-2xl max-h-[450px]"
                loop
                muted
                playsinline
            >
              <source
                  src="@/assets/img/investors/videos/6.mp4"
                  type="video/mp4"
              />
              {{ $t("aboutAI.notSupport") }}
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
