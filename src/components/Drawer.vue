<script setup>
import DriwerHead from "./DriwerHead.vue";
import CartItemList from "./CartItemList.vue";
import InfoBlock from "./InfoBlock.vue";

import { compile, computed } from "vue";

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
  buttonDisabled: Boolean,
});

const emit = defineEmits(["createOrder"]);
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div
    class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 flex flex-col justify-between"
  >
    <DriwerHead />
    <div class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="packageicon.png"
      />
    </div>

    <CartItemList v-if="totalPrice" />

    <div v-show="totalPrice" class="flex flex-col gap-4 mt-7">
      <div class="flex gap-2">
        <span>ИТОГО: </span>
        <div class="flex-1 border-b border-dashed"></div>
        <b> {{ totalPrice }} p</b>
      </div>

      <div class="flex gap-2">
        <span class="uppercase">Налог 5%: </span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ vatPrice }} p</b>
      </div>
      <button
        :disabled="buttonDisabled"
        @click="() => emit('createOrder')"
        class="mt-4 cursor-pointer transition bg-lime-500 disabled:bg-slate-400 w-full rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
