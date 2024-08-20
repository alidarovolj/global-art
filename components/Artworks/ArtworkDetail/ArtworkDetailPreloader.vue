<script setup>
const activeTab = ref(1);
const tabs = ref([
  {id: 1, name: "Artwork details"},
  {id: 2, name: "About the artist"},
  {id: 3, name: "Shipping & Returns"},
]);
</script>

<template>
  <div class="container mx-auto px-4 md:px-0 py-[88px] relative">
    <div class="block md:flex gap-[80px] mb-10 md:mb-[122px]">
      <div class="w-full mb-10 md:mb-0 md:w-[59%]">
        <div class="block md:hidden mb-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="skeleton max-w-2xl w-full h-10"/>
            <div class="rounded-full p-3 skeleton w-12 h-12"/>
          </div>
          <div class="mb-10 space-x-4">
            <div>
              <div class="flex">
                <p class="mr-4 w-[70px] font-bold"/>
                <p class="text-secondaryText"/>
              </div>
            </div>
          </div>
          <hr/>
          <div class="pb-10 border ">
            <div
                class="cursor-pointer mt-10 mb-6 flex justify-between space-x-4"
            >
              <p
                  class="text-primaryText font-bold text-lg skeleton w-full h-10"
              />
            </div>
            <div
                class="overflow-hidden transition-max-height duration-300 ease-in-out"
            >
              <div class="flex gap-3 mb-6">
                <p
                    class="skeleton h-10 w-full py-2 px-4 rounded-3xl cursor-pointer space-x-4"
                />
              </div>
              <div class="mb-6">
                <p class="text-primaryText font-bold skeleton h-5 w-28 mb-2"/>
                <div class="flex gap-3">
                  <div class="skeleton h-20 w-20"/>
                  <div class="skeleton h-20 w-20"/>
                  <div class="skeleton h-20 w-20"/>
                </div>
              </div>
              <div class="mb-10">
                <p class="skeleton h-5 w-28 mb-2"/>
                <div
                    class="flex flex-wrap gap-3 w-full md:w-3/5 cursor-pointer"
                >
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-10 md:mb-[112px]">
          <div
              class="relative flex items-center justify-center mb-4 py-[110px] bg-cardBg skeleton"
          >
            <div class="w-[410.5px] h-[573.5px]"/>
          </div>
          <div class="flex justify-center gap-4">
            <div
                class="bg-cardBg py-5 cursor-pointer select-none skeleton w-40 h-40"
            />
          </div>
        </div>
        <div class="block md:hidden mb-10">
          <div class="mt-10 mb-4">
            <p class="font-bold text-xl space-x-4"/>
            <span class="text-secondaryText text-sm"/>
          </div>
          <div
              class="skeleton h-10 mb-4 text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2"
          />
        </div>
        <div>
          <div class="flex gap-8 mb-2">
            <p
                v-for="tab of tabs"
                :key="tab.id"
                class="font-bold text-secondaryText text-xl leading-6 cursor-pointer skeleton h-5 w-28"
                @click="activeTab = tab.id"
            />
          </div>
          <div v-if="activeTab === 1" class="">
            <div class="mb-10">
              <p class="mb-2 text-primaryTex text-justify skeleton h-40"/>
              <p class="underline skeleton h-5 w-28"/>
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex">
                <p class="font-bold w-1/2 md:w-1/4"/>
                <p class="text-secondaryText underline w-1/2 md:w-max"/>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 2"/>
        </div>
      </div>
      <div class="w-full md:w-[39%]">
        <div class="hidden md:block">
          <div class="flex items-center justify-between mb-4">
            <h2 class="skeleton max-w-lg w-full h-10"/>
            <div class="rounded-full p-3 skeleton w-12 h-12"/>
          </div>
          <div class="pb-10 border-b ">
            <div class="">
              <div class="flex flex-col gap-2">
                <p class="mr-4 font-bold skeleton w-full h-5"/>
                <p class="mr-4 font-bold skeleton w-full h-5"/>
              </div>
            </div>
          </div>
          <div class="pb-10 border-b ">
            <div class="skeleton w-full h-10 mb-3 mt-6">
              <p class="text-primaryText font-bold text-lg"/>
            </div>
            <div
                class="overflow-hidden transition-max-height duration-300 ease-in-out"
            >
              <div class="flex gap-3 mb-6">
                <p class="skeleton h-10 w-full"/>
              </div>
              <div class="mb-6">
                <p class="text-primaryText font-bold mb-2 skeleton w-20 h-5"/>
                <div class="flex gap-3">
                  <div class="skeleton h-20 w-20"/>
                  <div class="skeleton h-20 w-20"/>
                  <div class="skeleton h-20 w-20"/>
                </div>
              </div>
              <div class="mb-10">
                <p class="skeleton w-20 h-5 mb-2"/>
                <div
                    class="flex flex-wrap gap-3 w-full md:w-3/5 cursor-pointer"
                >
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                  <div
                      class="flex items-center gap-2 w-[120px] pl-2 pr-4 py-3 rounded-3xl skeleton h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="mt-10 mb-4">
            <p class="font-bold text-xl skeleton h-5 w-20 mb-2"/>
            <p class="skeleton h-5 w-28"/>
          </div>
          <div class="skeleton mb-4 h-10 w-full"/>
        </div>
        <div class="pb-10 border-b ">
          <div class="flex gap-2 mb-2 skeleton w-28 h-5">
            <div class="underline text-base"/>
          </div>
          <div>
            <div class="mb-1 skeleton h-5 w-28">
              <span class="mr-2 text-secondaryText"/>
              <div class="underline text-base"/>
            </div>
            <div class="text-secondaryText skeleton h-5 w-28"/>
          </div>
        </div>
        <div class="mt-10 mb-6">
          <h2 class="font-bold mb-4 skeleton w-28 h-5"/>
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-4">
              <div class="skeleton w-20 h-20 rounded-full"/>
              <div>
                <h2 class="font-bold text-2xl leading-6 skeleton h-5 w-28"/>
                <span class="text-sm text-secondaryText skeleton h-5 w-28"/>
              </div>
            </div>
            <div
                class="skeleton h-8 w-28 py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
            />
          </div>
        </div>
        <p class="text-primaryText mb-4 skeleton h-5 w-28"/>
        <div
            class="skeleton h-5 w-32 text-white text-base py-2 px-4 rounded-3xl transition-all active:bg-primaryText active:text-white hover:bg-[#E8E8E8] hover:text-primaryText"
        />
      </div>
    </div>
    <div class="text-primaryText">
      <h2 class="font-bold text-2xl mb-10 skeleton h-8 w-28"/>
      <div class="flex flex-wrap gap-6">
        <div class="md:w-1/3 w-full skeleton h-[320px]">
          <img alt="" class="w-full object-cover mb-4" src=""/>
          <p class="font-bold text-2xl mb-4"/>
          <p class="text-primaryText text-justify md:text-left"/>
        </div>
        <div class="md:w-1/3 w-full skeleton h-[320px]">
          <img alt="" class="w-full object-cover mb-4" src=""/>
          <p class="font-bold text-2xl mb-4"/>
          <p class="text-primaryText text-justify md:text-left"/>
        </div>
      </div>
    </div>
  </div>
</template>
