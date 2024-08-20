<script setup>
import {useUserStore} from "~/store/user.js";
import {storeToRefs} from "pinia";
import {useLanguagesStore} from "~/store/languages.js";

const localePath = useLocalePath();

const {t} = useI18n();
const artist = useArtistsStore();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const pending = ref(true);

const user = useUserStore();
const {getSubscriptions} = user;
const {subscriptions} = storeToRefs(user);

const runtimeConfig = useRuntimeConfig();

const toggleSubscribe = async (id) => {
  await artist.addExcludeArtistSubscription(id);
  await getSubscriptions();
};

onMounted(async () => {
  await nextTick();
  await getSubscriptions();
  pending.value = false;
});

useHead({
  title: t("headers.profile.pages.following_artists.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.following_artists.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.following_artists.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.following_artists.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.following_artists.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.profile.pages.following_artists.canonical"),
    },
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <div class="w-full">
        <div>
          <div class="block md:flex justify-between items-center mb-8">
            <p class="text-2xl font-bold mb-3 md:mb-0 ">
              {{ $t("profile.followingArtists.title") }}
            </p>
          </div>
          <div v-if="!pending">
            <div
                v-if="subscriptions.data.length > 0"
                class="w-full flex flex-col gap-10"
            >
              <div
                  v-for="item in subscriptions.data"
                  :key="item.id"
                  class="flex justify-between cursor-pointer"
              >
                <div class="flex flex-col">
                  <div class="flex md:flex-row flex-col items-center gap-6">
                    <NuxtLink
                        :to="localePath(`/artists/${item.id}`)"
                        class="flex items-center gap-6"
                    >
                      <img
                          v-if="item.artist_photo"
                          :src="
                          runtimeConfig.public.ENDPOINTS_LINK +
                          item.artist_photo.full
                        "
                          alt="artist"
                          class="w-24 h-24 rounded-full object-cover"
                      />
                      <div
                          v-else
                          class="w-24 h-24 rounded-full border p-5">
                        <img
                            alt=""
                            class="w-full h-full object-contain"
                            src="@/assets/img/null.png">
                      </div>
                      <div>
                        <div class="flex font-semibold">
                          <p>{{ item.artist_base_info.translations[cur_lang].last_name }}&nbsp;</p>
                          <p>{{ item.artist_base_info.translations[cur_lang].first_name }}</p>
                        </div>
                        <p class="text-inner_head mb-2 md:mb-0">
                          {{ item.artist_base_info.state }},
                          {{ item.artist_base_info.country }}
                        </p>
                      </div>
                    </NuxtLink>
                    <div class="block w-full md:hidden">
                      <ButtonComponent
                          :class="{
                          'border bg-black text-white divide-y divide-gray-500   rounded-full p-2 px-6  hover:bg-white hover:text-black':
                            artist.detailArtist?.data?.artist_is_subscribed,
                        }"
                          :title="t('artists.unfollow')"
                          class="border block w-full divide-y divide-gray-500   rounded-full p-2 px-6  hover:bg-gray-100"
                          @click="toggleSubscribe(item.id)"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row gap-5 mt-6">
                    <div>
                      <p class="font-semibold mb-2 ">
                        {{ $t("profile.followingArtists.artistMaterial") }}
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <div
                            v-for="(material, index) in item.artist_art_materials"
                            :key="index"
                        >
                          <p
                              class="py-2 px-3 bg-[#F5F5F5]  rounded-full capitalize"
                          >
                            {{ material.translations[cur_lang].title }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold mb-2 ">
                        {{ $t("profile.followingArtists.artStyle") }}
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <div
                            v-for="(style, index) in item.artist_art_styles"
                            :key="index"
                        >
                          <p
                              class="py-2 px-3 bg-[#F5F5F5]  rounded-full capitalize"
                          >
                            {{ style.translations[cur_lang].title }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hidden md:block">
                  <ButtonComponent
                      :class="{
                      'border bg-black text-white divide-y divide-gray-500   rounded-full p-2 px-6  hover:bg-white hover:text-black':
                        artist.detailArtist?.data?.artist_is_subscribed,
                    }"
                      :title="t('artists.unfollow')"
                      class="border divide-y divide-gray-500   rounded-full p-2 px-6  hover:bg-gray-100"
                      @click="toggleSubscribe(item.id)"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <NoElements
                  :text="$t('profile.followingArtists.noArtistsText')"
                  :title="$t('profile.followingArtists.noArtists')"
                  class="mt-10"
              />
            </div>
          </div>
          <div v-else class="w-full flex flex-col gap-10">
            <div class="skeleton w-full h-40"/>
            <div class="skeleton w-full h-40"/>
            <div class="skeleton w-full h-40"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
