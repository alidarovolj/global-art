<script setup>
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from "@headlessui/vue";
import {XMarkIcon} from "@heroicons/vue/24/outline";
import {useModalsStore} from "~/store/modals.js";
import {computed, defineAsyncComponent} from 'vue';

const modals = useModalsStore();

const getModalComponent = (name) => {
  if (!name) return null;
  return defineAsyncComponent(() => import(`~/components/Modals/${name}.vue`));
};

const isModalVisible = computed(() => modals.modal.show);

const closeModal = () => {
  modals.modal.show = false;
};
</script>

<template>
  <TransitionRoot
      :show="isModalVisible"
      as="template">
    <Dialog
        class="relative z-50"
        @close="closeModal">
      <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 w-full">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    type="button"
                    @click="closeModal">
                  <span class="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" class="h-6 w-6"/>
                </button>
              </div>
              <component :is="getModalComponent(modals.modal.modalName)"/>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
