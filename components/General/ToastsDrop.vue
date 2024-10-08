<script setup>
import {useToastsStore} from '@/store/toastDropStore';
import {CheckCircleIcon, ExclamationCircleIcon} from '@heroicons/vue/24/outline';
import {XMarkIcon} from '@heroicons/vue/20/solid';
import {ref, watch} from 'vue';

const toasts = useToastsStore();
const progress = ref(100);

const startProgress = () => {
  progress.value = 100;
  setTimeout(() => {
    progress.value = 0;
  }, 0);
};

watch(() => toasts.toast.show, (newVal) => {
  if (newVal) {
    startProgress();
  }
});
</script>

<template>
  <div v-if="toasts.toast.show" aria-live="assertive"
       class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
        <div
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                    v-if="toasts.toast.type === 'success'" aria-hidden="true"
                    class="h-6 w-6 text-green-400"
                />
                <ExclamationCircleIcon v-else aria-hidden="true" class="h-6 w-6 text-red-400"/>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{ toasts.toast.title }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ toasts.toast.message }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                    class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    type="button"
                    @click="toasts.toast.show = false">
                  <span class="sr-only">Закрыть</span>
                  <XMarkIcon aria-hidden="true" class="h-5 w-5"/>
                </button>
              </div>
            </div>
            <div class="mt-2 h-1 w-full bg-gray-200">
              <div :style="{ width: progress + '%' }"
                   class="h-1 bg-blue-500 transition-all duration-[5000ms] ease-linear"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  height: 4px;
  background-color: #4299e1; /* Adjust this color to match your theme */
  transition: width 5s linear;
}
</style>