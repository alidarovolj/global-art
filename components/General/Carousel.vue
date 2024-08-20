<script lang="ts" setup>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";
import Painting from "~/components/General/Painting.vue";
import BlogBlock from "~/components/General/BlogBlock.vue";
import DetailArtistPortfolio from "~/components/DetailArtist/DetailArtistPortfolio.vue";

const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const myCarousel = ref(null);

const props = defineProps({
  data: Array as PropType<Array<YourDataType>>,
  title: String,
  showAll: String,
  link: String,
  type: String,
});

const breakpoints = computed(() => {
  if (props.data) {
    const itemsToShow = Math.min(4, props.data.length);
    return {
      700: {itemsToShow, snapAlign: "start"},
      1024: {itemsToShow, snapAlign: "start"},
    };
  }
});
</script>

<template>
  <div
      class="w-full mb-10 border-b border-bColor   pb-10"
  >
    <div class="block md:flex justify-between items-center mb-10">
      <h3
          class="text-3xl font-semibold mb-5 md:mb-0 whitespace-nowrap  "
      >
        {{ props.title }}
      </h3>
      <div class="w-full flex justify-between md:justify-end">
        <ButtonComponent
            v-if="props.showAll"
            :link="props.link"
            :title="props.showAll"
            :underline="false"
            class="border divide-y divide-gray-500   rounded-full p-2 mr-6 px-6  hover:bg-gray-100"
        >
          {{ props.showAll }}
        </ButtonComponent>
        <div class="flex flex-row-reverse">
          <button
              class="border divide-y divide-gray-500 rounded-full p-2 ml-3 transition-all hover:bg-gray-100"
              @click="myCarousel.next"
          >
            <ChevronRightIcon class="w-5 h-5"/>
          </button>
          <button
              class="border divide-y divide-gray-500 rounded-full p-2 mr-3 transition-all hover:bg-gray-100"
              @click="myCarousel.prev"
          >
            <ChevronLeftIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
    <div
        v-if="props.data && breakpoints['700'].itemsToShow"
        class="carousel_main"
    >
      <div v-if="props.type === 'painting'">
        <ClientOnly>
          <my-carousel-carousel
              ref="myCarousel"
              :breakpoints="breakpoints"
              :items-to-show="settings.itemsToShow"
              :mouse-drag="false"
              :touch-drag="false"
              class="flex"
          >
            <my-carousel-slide v-for="slide in props.data" :key="slide.id">
              <Painting
                  :id="slide.id"
                  :artist="slide.art_item_artist"
                  :artwork_data="slide"
                  :images="slide.art_item_images"
                  :is_in_wish_list="slide.is_in_wish_list"
                  :price="slide.art_item_price"
                  :title="slide.art_item_title"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
      <div v-if="props.type === 'blogTrending'">
        <ClientOnly>
          <my-carousel-carousel
              ref="myCarousel"
              :breakpoints="breakpoints"
              :items-to-show="settings.itemsToShow"
              :mouse-drag="false"
              :touch-drag="false"
              class="flex"
          >
            <my-carousel-slide v-for="slide in props.data" :key="slide.id">
              <BlogTrending
                  v-if="slide.articles.length > 0"
                  :id="slide.id"
                  :alias="slide.article_category_alias"
                  :articles="slide.articles"
                  :title="slide.article_category_title"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
      <div v-if="props.type === 'blog'">
        <ClientOnly>
          <my-carousel-carousel
              ref="myCarousel"
              :breakpoints="breakpoints"
              :items-to-show="settings.itemsToShow"
              :mouse-drag="false"
              :touch-drag="false"
              class="flex"
          >
            <my-carousel-slide v-for="slide in props.data" :key="slide.id">
              <BlogBlock
                  :id="slide.id"
                  :content="slide.content"
                  :date="slide.date"
                  :description="slide.description"
                  :duration="slide.duration"
                  :img="slide.img"
                  :name="slide.name"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
      <div v-if="props.type === 'artist'" class="artist">
        <ClientOnly>
          <my-carousel-carousel
              ref="myCarousel"
              :breakpoints="breakpoints"
              :items-to-show="settings.itemsToShow"
              :mouse-drag="false"
              :touch-drag="false"
              class="flex"
          >
            <my-carousel-slide v-for="slide in props.data" :key="slide.id">
              <Artist
                  :id="slide.id"
                  :artist_data="slide"
                  :available="slide.artist_is_available"
                  :img="
                  slide.artist_app_user.params.photo
                    ? slide.artist_app_user.params.photo.full
                    : null
                "
                  :name="slide.artist_name"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
      <div v-if="props.type === 'artist_portfolio'" class="artist">
        <ClientOnly>
          <my-carousel-carousel
              ref="myCarousel"
              :breakpoints="breakpoints"
              :items-to-show="settings.itemsToShow"
              :mouse-drag="false"
              :touch-drag="false"
              class="flex"
          >
            <my-carousel-slide v-for="slide in props.data" :key="slide.title">
              <DetailArtistPortfolio
                  :img="slide.photo.medium"
                  :title="slide.title"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
    </div>
    <div v-else class="flex flex-col md:flex-row justify-between">
      <div
          v-for="slide in 4"
          :key="slide"
          class="flex flex-col justify-start pr-0 md:pr-10 w-full mb-5 md:mb-0"
      >
        <div
            class="skeleton mb-3 h-8 w-full border border-bColor  px-7 py-28 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
        />
        <div class="flex flex-col text-start justify-start w-full">
          <div class="text-base mb-2">
            <div class="py-2 max-w-sm w-full mx-auto">
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1">
                  <div
                      class="skeleton h-8 w-full border border-bColor  py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="py-2 max-w-sm w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1">
                <div
                    class="skeleton h-8 w-full border border-bColor  py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                />
              </div>
            </div>
          </div>
          <div class="font-bold text-base mb-2">
            <div class="py-2 max-w-sm w-full mx-auto">
              <div class="animate-pulse flex space-x-4">
                <div class="flex items-center flex-1">
                  <div
                      class="skeleton h-8 w-8 border border-bColor  py-1 mr-3 px-4 rounded-full text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                  />
                  <div
                      class="skeleton h-8 w-full border border-bColor  py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
