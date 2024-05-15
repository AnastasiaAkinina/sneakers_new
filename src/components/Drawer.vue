<script setup>
import DriwerHead from "./DriwerHead.vue";
import CartItemList from "./CartItemList.vue";
import InfoBlock from "./InfoBlock.vue";

import { ref, compile, computed, inject } from "vue";
import axios from "axios";

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
});

const { cart, closeDrawer } = inject("cart");

//Переменная для 'заказ на оформлении'
const isCreating = ref(false);
const orderId = ref(null);

// Создаем заказ на бэк
const createOrder = async () => {
  try {
    isCreating.value = true;
    const { data } = await axios.post(`https://290dddb232f0bb1a.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: props.totalPrice.value,
    });
    cart.value = [];

    orderId.value = data.id;
  } catch (err) {
    console.log(err);
  } finally {
    isCreating.value = false;
  }
};
//Если корзина пустая
const cartIsEmpty = computed(() => cart.value.length === 0);

// // Кнопка сделать заказ серая(Disabled) если isCreatinOrder==true или корзина пустая
const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value);
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div
    class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 flex flex-col justify-between"
  >
    <DriwerHead />
    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        image-url="order-success-icon.png"
      />

      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="packageicon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 mt-7">
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
          @click="createOrder"
          class="mt-4 cursor-pointer transition bg-lime-500 disabled:bg-slate-400 w-full rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
