<script setup></script>

<template>
  <div>
    <div class="flex gap-20 mt-32 pb-10 border-b border-gray-300">
      <div class="flex gap-10">
        <div class="flex flex-col justify-between w-96 h-96">
          <div class="flex flex-col gap-10">
            <div class="skeleton h-10"/>
            <div class="skeleton h-10"/>
          </div>
          <div class="skeleton h-10"/>
        </div>
        <div class="skeleton w-96"/>
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex gap-6">
          <div class="skeleton w-28 h-28"/>
          <div class="flex flex-col gap-4">
            <div class="skeleton w-32 h-6"/>
            <div class="skeleton w-32 h-6"/>
          </div>
        </div>
        <div class="flex gap-6">
          <div class="skeleton w-28 h-28"/>
          <div class="flex flex-col gap-4">
            <div class="skeleton w-32 h-6"/>
            <div class="skeleton w-32 h-6"/>
          </div>
        </div>
        <div class="flex gap-6">
          <div class="skeleton w-28 h-28"/>
          <div class="flex flex-col gap-4">
            <div class="skeleton w-32 h-6"/>
            <div class="skeleton w-32 h-6"/>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-10 w-1/5 mt-10">
      <div v-for="item in 5">
        <div class="skeleton w-52 h-40"/>
      </div>
    </div>
  </div>
</template>
