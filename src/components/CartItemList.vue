<script setup>
import { inject } from "vue";
import CartItem from "./CartItem.vue";

// инжектим обьект cart и вытаскиваем свойствa и addToCart cart из этого обьекта
const { cart, removeFromCart } = inject("cart");

// Удаление товара из корзины
</script>

<template>
  <div class="flex flex-1 flex-col gap-5">
    <!-- Рендерим список внутри корзины  -->
    <CartItem
      v-for="item in cart"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :image-url="item.imageUrl"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>
