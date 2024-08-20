<script setup>
const layout = "ailayout";
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <h2 class="text-3xl md:text-6xl font-bold mb-8 md:mb-16">
        {{ $t("aboutAI.platform") }}
      </h2>
      <NuxtLayout :name="layout">
        <div id="generating" class="mb-28">
          <h2 class="text-2xl md:text-5xl font-bold mb-3">
            {{ $t("aboutAI.generate") }}
          </h2>
          <p class="text-base md:text-xl mb-8">
            {{ $t("aboutAI.exploreStyles") }}
          </p>
          <video
              autoplay
              class="w-full h-auto object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source src="@/assets/img/aboutAI/scratch.mp4" type="video/mp4"/>
            {{ $t("aboutAI.notSupport") }}
          </video>
        </div>
        <div id="inspiration" class="mb-28">
          <h2 class="text-2xl md:text-5xl font-bold mb-3">
            {{ $t("aboutAI.inspiredArtists") }}
          </h2>
          <p class="text-base md:text-xl mb-8">
            {{ $t("aboutAI.keepEthical") }}
          </p>
          <video
              autoplay
              class="w-full h-auto object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source
                src="@/assets/img/aboutAI/inspiration.mp4"
                type="video/mp4"
            />
            {{ $t("aboutAI.notSupport") }}
          </video>
        </div>
        <div id="editing" class="mb-28">
          <h2 class="text-2xl md:text-5xl font-bold mb-3">
            {{ $t("aboutAI.edit") }}
          </h2>
          <p class="text-base md:text-xl mb-8">
            {{ $t("aboutAI.applyStyles") }}
          </p>
          <video
              autoplay
              class="w-full h-auto object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source src="@/assets/img/aboutAI/editing.mp4" type="video/mp4"/>
            {{ $t("aboutAI.notSupport") }}
          </video>
        </div>
        <div id="actions">
          <h2 class="text-2xl md:text-5xl font-bold mb-3">
            {{ $t("aboutAI.resize") }}
          </h2>
          <video
              autoplay
              class="w-full h-auto object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source src="@/assets/img/aboutAI/resize.mp4" type="video/mp4"/>
            {{ $t("aboutAI.notSupport") }}
          </video>
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
