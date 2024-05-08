<script setup>
const props = defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  size: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickAdd: Function,
  onClickFavorite: Function,
});
</script>

<template>
  <div>
    <div
      class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
    >
      <img
        @click="onClickFavorite"
        :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
        alt="/"
        class="absolute top-8 left-8"
      />
      <img :src="imageUrl" alt="/" />

      <p class="mt-2">{{ title }}</p>

      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <span class="text-slate-400 uppercase">Цена:</span>
          <b>{{ price }} руб.</b>
        </div>

        <img @click="onClickAdd" :src="!isAdded ? '/plus.svg' : '/checked.svg'" alt="/" />
      </div>

      <div>
        <p class="text-slate-400 uppercase mb-2 mt-4">SIZE:</p>

        <label class="mr-2">
          <input class="mr-2" type="checkbox" name="size" value="yes" />{{ size }}
        </label>
      </div>
    </div>
  </div>
</template>
