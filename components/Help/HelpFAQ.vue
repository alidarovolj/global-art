<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {MinusSmallIcon, PlusSmallIcon} from '@heroicons/vue/24/outline'

const {t} = useI18n();

const questions = ref([
  {
    title: t("help.general.questions.first.title"),
    content: t("help.general.questions.first.content"),
  },
  {
    title: t("help.general.questions.second.title"),
    content: t("help.general.questions.second.content"),
  },
  {
    title: t("help.general.questions.third.title"),
    content: t("help.general.questions.third.content"),
  },
  {
    title: t("help.general.questions.fourth.title"),
    content: t("help.general.questions.fourth.content"),
  },
  {
    title: t("help.general.questions.fifth.title"),
    content: t("help.general.questions.fifth.content"),
  },
]);
const activeIndex = ref(null);
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto w-full py-12">
      <div class="mx-auto w-full divide-y divide-gray-900/10">
        <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          {{ t("help.general.title") }}
        </h2>
        <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
          <Disclosure
              v-for="(faq, index) of questions"
              :key="index"
              v-slot="{ open }"
              as="div"
              class="pt-6">
            <dt>
              <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                <span class="text-base font-semibold leading-7">{{ faq.title }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusSmallIcon v-if="!open" aria-hidden="true" class="h-6 w-6"/>
                  <MinusSmallIcon v-else aria-hidden="true" class="h-6 w-6"/>
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
              <p class="text-base leading-7 text-gray-600">{{ faq.content }}</p>
            </DisclosurePanel>
          </Disclosure>
        </dl>
      </div>
    </div>
  </div>
</template>
