<script setup></script>

<template>
  <div class="container mx-auto px-4 md:px-0 pt-0 md:pt-[200px] pb-[200px]">
    <div class="block md:flex justify-between items-center gap-10">
      <div
          class="w-full md:w-1/2 flex flex-col justify-between pt-0 md:pt-20 mb-28 md:mb-0 "
      >
        <h2 class="text-2xl md:text-7xl font-semibold mb-6">
          {{ $t("landing.orderCustomArt.title.main") }}
          <span class="italic"
          >{{ $t("landing.orderCustomArt.title.span") }}
          </span>
        </h2>
        <p class="text-lg md:text-2xl font-normal md:font-semibold mb-6">
          {{ $t("landing.orderCustomArt.description") }}
        </p>
        <div class="flex flex-col md:flex-row gap-4">
          <Base-button class="py-3 px-6 w-full md:w-max" to="/artists">
            {{ $t("landing.orderCustomArt.findBtn") }}
          </Base-button>
        </div>
      </div>
      <div class="w-full md:w-1/2 relative">
        <img
            alt=""
            class="w-40 h-40 rounded-full object-cover object-top absolute -left-10 md:-left-28 -top-20"
            src="@/assets/img/landing/photos/1.jpg"
        />
        <img
            alt=""
            class="w-20 h-20 rounded-full object-cover object-top absolute left-48 md:left-28 -top-24"
            src="@/assets/img/landing/photos/2.jpg"
        />
        <img
            alt=""
            class="w-20 h-20 rounded-full object-cover object-top absolute right-0 md:right-28 -top-24"
            src="@/assets/img/landing/photos/3.jpg"
        />
        <img
            alt=""
            class="w-40 h-40 rounded-full object-cover object-top absolute right-0 md:-right-28 top-24"
            src="@/assets/img/landing/photos/4.jpg"
        />
        <div
            class="absolute left-0 bottom-0 translate-x-10 md:-translate-x-1/2 translate-y-1/2"
        >
          <div
              class="w-40 h-max bg-white   p-3 shadow-xl rounded-2xl"
          >
            <img
                alt=""
                class="w-full h-32 rounded-full object-cover object-top mb-3"
                src="@/assets/img/landing/photos/5.jpg"
            />
            <p class="text-center w-full text-sm">
              {{ $t("landing.orderCustomArt.available") }}
            </p>
          </div>
        </div>
        <img
            alt=""
            class="w-20 md:w-40 h-20 md:h-40 rounded-full object-cover object-top absolute right-0 bottom-0 translate-x-0 md:translate-x-1/2 translate-y-1/2"
            src="@/assets/img/landing/photos/6.jpg"
        />
        <video
            autoplay
            class="w-full h-auto object-cover rounded-2xl"
            loop
            muted
            playsinline
        >
          <source src="@/assets/img/landing/order.mp4" type="video/mp4"/>
          {{ $t("landing.orderCustomArt.video") }}
        </video>
        <p
            class="absolute left-1/2 -translate-x-1/2 top-10 w-max bg-white p-2 rounded-full text-black font-bold"
        >
          {{ $t("landing.orderCustomArt.makeReference") }}
        </p>
      </div>
    </div>
  </div>
</template>
