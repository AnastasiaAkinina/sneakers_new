<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import CardList from "../components/CardList.vue";
import { iSneakers } from "../ts/Sneakers";

const favorites = ref<iSneakers[]>([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(
      "https://290dddb232f0bb1a.mokky.dev/favorites?_relations=items"
    );
    favorites.value = data.map((obj) => obj.item);
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>

  <CardList :items="favorites" is-favorites />
</template>
