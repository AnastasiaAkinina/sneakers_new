<script setup>
//Вытаскиваем пропс кемал-кейс(openDrawer)
const emit = defineEmits(["openDrawer", "fetchUsers"]);

// const { openDrawer } = provide("cart");

const props = defineProps({
  user: String,
  totalPrice: Number,
});
</script>

<template>
  <header class="flex justify-between border-b border-slate-300 px-10 py-8">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img class="w-10" src="/logo.png" alt="/" />
        <div>
          <h2 class="text-xl font-bold uppercase">Vue Sneakers</h2>
          <p class="text-slate-500">Магазин лучших кроссовок</p>
        </div>
      </div></router-link
    >

    <ul class="flex items-center gap-10">
      <!-- /*Вызываем функцию 'openDrawer с помощью emit(открываем окно корзины)*/  -->
      <li
        @click="() => emit('openDrawer')"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="/" />
        <b>{{ totalPrice }} руб</b>
      </li>

      <router-link to="/favorites"
        ><li
          class="flex items-center cursor-pointer gap-3 text-slate-500 hover:text-black"
        >
          <img src="/heart.svg" alt="/" />
          <span>Закладки</span>
        </li></router-link
      >
      <router-link to="/profile">
        <li
          class="flex items-center cursor-pointer gap-3 text-slate-500 hover:text-black"
        >
          <img src="/profile.svg" alt="/" />
          <span>Профиль</span>
        </li></router-link
      >
    </ul>
  </header>
</template>
