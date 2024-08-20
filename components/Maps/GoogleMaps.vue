<script setup>
import {onMounted, ref} from "vue";
import {useRuntimeConfig} from "#app";

const emit = defineEmits(["updateAddress"]);
const props = defineProps(["address"]);

const form = ref({
  country: null,
  city: null,
  state: null,
  postalCode: null,
  address: null,
});

const markers = ref([]);
const suggestions = ref([]);
const searchQuery = ref("");
const autocompleteService = ref(null);

const center = ref({lat: 43.2183318, lng: 76.6228716});

const mapOptions = ref({
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
});

const mapLoaded = ref(false);

const loadGoogleMapsApi = async () => {
  try {
    const {Loader} = await import("@googlemaps/js-api-loader");

    const loader = new Loader({
      apiKey: useRuntimeConfig().public.GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    await loader.load();
    autocompleteService.value = new google.maps.places.AutocompleteService();
    mapLoaded.value = true;
    console.log("Google Maps API loaded");
    if (props.address) {
      searchQuery.value = props.address;
    }
  } catch (error) {
    console.error("Failed to load Google Maps API", error);
  }
};

const getCoordinates = async (event) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  markers.value = [
    {
      position: {
        lat: lat,
        lng: lng,
      },
    },
  ];

  const geocoder = new google.maps.Geocoder();
  const latLng = {lat, lng};
  geocoder.geocode({location: latLng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        form.value.address = results[0].formatted_address;
        results[0].address_components.forEach((component) => {
          if (component.types.includes("country")) {
            form.value.country = component.short_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            form.value.state = component.long_name;
          }
          if (component.types.includes("locality")) {
            form.value.city = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            form.value.postalCode = component.long_name;
          }
        });
        emit("updateAddress", form.value);
      } else {
        console.log("No results found");
      }
    } else {
      console.log("Geocoder failed due to: " + status);
    }
  });
};

const handleSearchInput = () => {
  if (searchQuery.value.length > 0) {
    autocompleteService.value.getPlacePredictions(
        {input: searchQuery.value},
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            suggestions.value = predictions;
          } else {
            suggestions.value = [];
          }
        }
    );
  } else {
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.description;
  suggestions.value = [];

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({placeId: suggestion.place_id}, (results, status) => {
    if (status === "OK" && results[0]) {
      const latLng = results[0].geometry.location;
      center.value = {lat: latLng.lat(), lng: latLng.lng()};
      markers.value = [
        {
          position: {
            lat: latLng.lat(),
            lng: latLng.lng(),
          },
        },
      ];
      form.value.address = results[0].formatted_address;
      results[0].address_components.forEach((component) => {
        if (component.types.includes("country")) {
          form.value.country = component.short_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          form.value.state = component.long_name;
        }
        if (component.types.includes("locality")) {
          form.value.city = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          form.value.postalCode = component.long_name;
        }
      });

      emit("updateAddress", form.value);
    }
  });
};

onMounted(async () => {
  const config = useRuntimeConfig();
  const app = await import("vue").then((module) => module.createApp({}));
  app.use(VueGoogleMaps, {
    load: {
      key: config.public.GOOGLE_MAPS_API_KEY,
      libraries: "places",
    },
  });
  await loadGoogleMapsApi();
});
</script>

<template>
  <client-only>
    <div class="relative">
      <div
          class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 mb-2"
      >
        <label class="block text-xs font-medium text-gray-900" for="name">
          {{ $t("profile.address.title") }}
        </label>
        <input
            v-model="searchQuery"
            :placeholder="$t('profile.address.addNew')"
            class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            type="text"
            @input="handleSearchInput"
        />
      </div>
      <ul
          v-if="suggestions.length"
          class="absolute bg-white border rounded mt-1 w-full z-50 text-sm"
      >
        <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="p-2 cursor-pointer hover:bg-gray-200"
            @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.description }}
        </li>
      </ul>
    </div>
    <div v-if="mapLoaded">
      <GMap
          ref="myMarker"
          :center="center"
          :disable-default-u-i="true"
          :options="mapOptions"
          :zoom="7"
          class="w-full h-[300px] rounded-lg"
          map-type-id="roadmap"
          @click="getCoordinates"
      >
        <GMapMarker
            v-for="(marker, index) in markers"
            :key="index"
            :clickable="true"
            :draggable="true"
            :position="marker.position"
        />
      </GMap>
    </div>
  </client-only>
</template>

<style scoped>
/* Add your styles here */
</style>