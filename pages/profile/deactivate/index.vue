<script setup>
import {useUserStore} from "~/store/user.js";

const localePath = useLocalePath();

const user = useUserStore();
const confirmed = ref(false);
const id = ref(null);

const confirm = async () => {
  const userInfo = {
    id: id.value,
    new_value: false,
    text: "Option 1",
  };
  await user.deactivateUser(userInfo);
  confirmed.value = !confirmed.value;
};

onMounted(async () => {
  await nextTick();
  await user.getProfile();
  id.value = user.result.data.id;
});
</script>

<template>
  <div class="w-full">
    <div v-if="!confirmed">
      <p class="text-2xl font-bold mb-10">Deactivate your account</p>
      <p class="text-xl font-bold mb-10">Important considerations:</p>
      <ul class="w-1/2 list-disc">
        <li class="mb-2">
          <p>
            <span class="font-bold">Active orders:</span> Ensure that all active
            orders are either completed or canceled in adherence to our
            cancellation policy. Cancellation fees may apply. Refer to our Help
            Center for more details.
          </p>
        </li>
        <li>
          <p>
            <span class="font-bold">Custom art requests:</span> Deactivating
            your account results in the cancellation of active custom art
            orders. Refunds are not applicable in the event of a canceled order.
            For further details, please refer to our Help Center.
          </p>
        </li>
      </ul>
      <p class="font-bold mt-8">Need Assistance?</p>
      <p>
        Our support team is ready to assist you in making informed decisions
        about your account.
      </p>
      <p class="font-bold text-xl mt-12">
        Why do you want to deactivate you account?
      </p>
      <select
          id=""
          class="py-[15.5px] px-4 border border-bColor rounded-lg bg-white w-1/2"
          name=""
      >
        <option :value="null">Select reason</option>
        <option :value="null">Option 1</option>
        <option :value="null">Option 2</option>
      </select>
      <div class="w-1/2 flex justify-between mt-8">
        <button
            class="underline"
            @click="navigateTo(localePath('/profile/profile'))"
        >
          {{ $t("profile.profile.cancel") }}
        </button>
        <button
            class="bg-black py-3 px-6 text-white rounded-full font-bold"
            @click="confirm"
        >
          Next
        </button>
      </div>
    </div>
    <div v-if="confirmed">
      <p class="text-2xl font-bold mb-10">Account deactivated</p>
      <ul class="w-1/2 list-disc">
        <li class="mb-2">
          <p>
            <span class="font-bold">Active orders:</span> Ensure that all active
            orders are either completed or canceled in adherence to our cancellation
            policy. Cancellation fees may apply. Refer to our Help Center for more
            details.
          </p>
        </li>
        <li>
          <p>
            <span class="font-bold">Custom art requests:</span> Deactivating your
            account results in the cancellation of active custom art orders. Refunds
            are not applicable in the event of a canceled order. For further
            details, please refer to our Help Center.
          </p>
        </li>
      </ul>
      <p class="font-bold mt-4">
        Your account deletion will be completed once you confirm your request
        through the email instructions
      </p>
    </div>
  </div>
</template>
