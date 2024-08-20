<script setup></script>

<template>
  <div>
    <div
        class="z-[1000] fixed left-0 top-0 bg-white w-full h-screen flex items-center justify-center"
    >
      <div class="block">
        <div class="flex items-center gap-3 mb-5">
          <div>
            <img
                alt="Logo"
                class="min-w-20 w-20 min-h-20 h-20"
                src="@/assets/img/logo.svg"
            />
          </div>
          <p
              class="font-bold whitespace-nowrap text-3xl  "
          >
            Global Art AI
          </p>
        </div>
        <div class="spinner p-5"/>
      </div>
    </div>
  </div>
</template>
