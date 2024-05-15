<script setup>
// импорт нужен для функции addToFavorite через provide
import { ref } from "vue";
import Card from "./Card.vue";

defineProps({
  items: Array,
  isFavorites: Boolean,
  meta: Object,
});

const currentPage = ref(1);
const emit = defineEmits(["addToFavorite", "addToCart", "onClickPage"]);

const onClickHandler = (page) => {
  emit("onClickPage", page);
};
</script>

<template>
  <div v-auto-animate class="grid grid-cols-4 gap-5 mb-24">
    <Card
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', item)"
      :onClickAdd="isFavorites ? null : () => emit('addToCart', item)"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
    />
  </div>
  <div class="flex justify-center">
    <vue-awesome-paginate
      :total-items="meta.total_items"
      :items-per-page="meta.per_page"
      :max-pages-shown="5"
      v-model="currentPage"
      :on-click="onClickHandler"
    />
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}
.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #66bb75;
  border: 1px solid #afc6d6;
  color: white;
}
.active-page:hover {
  background-color: #52915e;
}
</style>
