<script setup>
import {ArchiveBoxIcon, ShieldCheckIcon} from "@heroicons/vue/24/outline";

const localePath = useLocalePath();
</script>

<template>
  <div class="mb-40">
    <div class="container mx-auto px-4 md:px-0">
      <div>
        <h2
            class="text-center text-2xl md:text-7xl font-semibold mb-20 "
        >
          {{ $t("landing.gridBlock.title.main") }}
          <span class="italic">{{ $t("landing.gridBlock.title.span") }}</span>
        </h2>
        <div class="block md:flex justify-between gap-6">
          <div
              class="flex flex-col justify-between w-full md:w-1/2 bg-[#EDEDED]   pl-10 pt-10 mb-6 md:mb-0"
          >
            <div>
              <ShieldCheckIcon class="mb-6 w-12 h-12"/>
              <p class="text-2xl md:text-5xl mb-5">
                <span class="italic text-bold">{{
                    $t("landing.gridBlock.authenticity.title")
                  }}</span>
                <br/>
                <span class="uppercase text-semibold">{{
                    $t("landing.gridBlock.authenticity.subtitle")
                  }}</span>
              </p>
              <p class="text-xl mb-5">
                {{ $t("landing.gridBlock.authenticity.description") }}
              </p>
            </div>
            <div class="flex justify-end">
              <img alt="" src="@/assets/img/landing/auth.png"/>
            </div>
          </div>
          <div class="w-full md:w-1/2 flex flex-col justify-between gap-6">
            <div
                class="w-full h-full bg-[#EDEDED]   p-10 flex flex-col justify-between"
            >
              <ArchiveBoxIcon class="mb-5 w-12 h-12"/>
              <div class="mb-5">
                <p class="text-3xl font-semibold mb-2">
                  {{ $t("landing.gridBlock.delivery.title") }}
                </p>
                <p class="text-xl">
                  {{ $t("landing.gridBlock.delivery.description") }}
                </p>
              </div>
              <NuxtLink

                  :to="localePath('/')"
                  class="hover:bg-black hover:text-white transition-all border py-3 px-6 rounded-full border-[#CCC] w-max"
              >
                {{ $t("landing.gridBlock.delivery.link") }}
              </NuxtLink>
            </div>
            <div
                class="w-full h-full bg-[#EDEDED]   p-10 flex flex-col justify-between"
            >
              <div class="mb-5">
                <p class="text-3xl font-semibold mb-2">
                  {{ $t("landing.gridBlock.expertGuidance.title") }}
                </p>
                <p class="w-full md:w-1/2 text-xl">
                  {{ $t("landing.gridBlock.expertGuidance.description") }}
                </p>
              </div>
              <NuxtLink

                  :to="localePath('/')"
                  class="hover:bg-black hover:text-white transition-all border py-3 px-6 rounded-full border-[#CCC] w-max"
              >
                {{ $t("landing.gridBlock.expertGuidance.link") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
