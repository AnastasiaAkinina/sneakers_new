<script setup lang="ts">
import { provide, reactive, ref, watch, computed } from "vue";
import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";

import { iSneakers } from "./ts/Sneakers.ts";

/* Корзина Корзина Корзина Корзина Корзина Корзина Корзина Корзина Корзина*/

// Создаем массив в котором будет храниться спимок товаров в корзине
const cart = ref<iSneakers[]>([]);
// Итого
const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0));
// Процент
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100));
// // Кнопка сделать заказ серая(Disabled) если isCreatinOrder==true или корзина пустая
// const cartButtonDisabled = computed(() => isCreatinOrder.value || cartIsEmpty.value);

const drawerOpen = ref<boolean>(false);
// функция закрывает окошко корзины
const closeDrawer = () => {
  drawerOpen.value = false;
};
// функция открывает окошко корзины
const openDrawer = () => {
  drawerOpen.value = true;
};
// Функция которая добавляет товары в корзину
const addToCart = (item: iSneakers) => {
  cart.value.push(item);
  item.isAdded = true;
};
// Удаляем товар из корзины(с помощью метода splice мы находим индекс этого item и
// удалить один элемент )
const removeFromCart = (item: iSneakers) => {
  cart.value.splice(cart.value.indexOf(item), 1);
  item.isAdded = false;
};

// функция вызывается при клике на кнопку добавить в корзину
const onClickAddPlus = (item: iSneakers) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

// чтобы после перезагрузки страницыинфо в карточках не менялась(например товары в корзине)
// любое изменение корзины сохраняется в локал сторедж
watch(
  cart,
  () => {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  },
  { deep: true } // глубокая проверка
);

/* Корзина Корзина Корзина Корзина Корзина Корзина Корзина Корзина Корзина*/
provide("cart", {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
  onClickAddPlus,
});
</script>
<template>
  <!--рендерится только в том случае если drawerOpen=true-->
  <Drawer :total-price="totalPrice" :vatPrice="vatPrice" v-if="drawerOpen" />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <!-- предаем пропсы(указываем сами события в пропсах) называем кебаб-кейс(open-drawer) -->
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>

