<script setup lang="ts">
import { onMounted, provide, reactive, ref, watch, computed, inject } from "vue";
import axios from "axios";
import debounce from "lodash.debounce";

import CardList from "../components/CardList.vue";

import { iSneakers } from "../ts/Sneakers";

const { cart, addToCart, removeFromCart, onClickAddPlus } = inject("cart");

// Хранятся все кроссовки(массив)
const items = ref<iSneakers[]>([]);
const meta = ref({});
const currentPage = ref<boolean>(1);

// Функции следят за изменением селекта и инпута
const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};
const onChangeSearchInput = debounce((event) => {
  filters.searchQuert = event.target.value;
}, 500);

// Хранит фильтры
const filters = reactive({
  sortBy: "title",
  searchQuert: "",
});

// Когда хотим добавить товар в закладку
const addToFavorite = async (item: iSneakers) => {
  try {
    // Проверяем был ли добавлен этот товар
    if (!item.isFavorite) {
      // Если нет, то создаем этот товар
      const obj = {
        item_id: item.id,
      };
      item.isFavorite = true;
      const { data } = await axios.post(
        `https://290dddb232f0bb1a.mokky.dev/favorites`,
        obj
      );

      // и прикручиваем ID
      item.favoriteId = data.id;
    }
    // Но если товар уже был добавлен в заклаки
    else {
      item.isFavorite = false;

      //то удаляем товар по Id item.isFavoriteId
      await axios.delete(
        `https://290dddb232f0bb1a.mokky.dev/favorites/${item.favoriteId}`
      );
      item.favoriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const onClickPage = (page) => {
  currentPage.value = page;
};

// Функция при каждом изменении элементов или при первом рендере, выполняет запрос на бэк
// запрашивает только списак товаров
const fetchItems = async () => {
  try {
    // по умолчанию сортировка sortBy: "title",
    const params = {
      sortBy: filters.sortBy,
      page: currentPage.value,
      limit: 8,
    };

    // изменение инпута=> изменение params которые будут отправляться на бэк
    if (filters.searchQuert) {
      params.title = `*${filters.searchQuert}*`;
    }
    // Делаем запрос на бэк и передаем параметры
    const { data } = await axios.get(`https://290dddb232f0bb1a.mokky.dev/items`, {
      params,
    });
    // Как пришел ответ вшиваем его в  items
    // Для fetchFavorites запросить все данные с помощью fetchItems,
    // сохранить их в таком формате(структура items.value) дальше в fetchFavorites
    meta.value = data.meta;
    items.value = data.items.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }));
  } catch (err) {
    console.log(err);
  }
  // и рендерим это все с помощью  <CardList :items="items" /> внизу
  // в CardList мы передаем defineProps в котором с помощью директивы  v-for будет рендерить карточки
};

// Функция запрашивает закладки(отмечены сердечком)
// В этом запросе мы будем пробегаться по нашему массиву data
// и менять isFavorite на true/false
const fetchFavorites = async () => {
  try {
    // Запросили закладки
    const { data: favorites } = await axios.get(
      `https://290dddb232f0bb1a.mokky.dev/favorites`
    );
    // Проходимся по каждому обьекту кроссовок и проверяем есть ли он внутри ресурса
    // favorites если есть значит он есть в закладках
    // (Нашли товар в закладках по parentId проверили что он равен item.id)
    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id);
      // Если закладки нет, то вернем сам item
      if (!favorite) {
        return item;
      }
      // Если закладка есть, то мы вернем новый обьект
      // обновляем его состояние
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const showUserFavorites = () => {
  const fav = user.value.favorites;
  items.value = items.value.map((item) => {
    const favorite = fav.find((favorite) => favorite === item.id);
    if (!favorite) {
      return item;
    }
    // Если закладка есть, то мы вернем новый обьект
    // обновляем его состояние
    return {
      ...item,
      isFavorite: true,
      favoriteId: favorite.id,
    };
  });
};

const fetchUsers = async () => {
  try {
    const { data: userData } = await axios.get(
      `https://290dddb232f0bb1a.mokky.dev/user/1`
    );

    user.value = userData;
  } catch (err) {
    console.log(err);
  }
};

// Сортировка товаров(монтирование)
onMounted(async () => {
  //
  const localCart = localStorage.getItem("cart");
  cart.value = localCart ? JSON.parse(localCart) : [];

  await fetchItems(); // получаем все кроссовки
  await fetchFavorites(); // запрос на получение списка закладок

  // Чтобы кнопки добавлен в корзину оставались отмеченными при перезагрузке страницы
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }));
});

// следит за изменением корзины и при клике на кнопку отправить заказ меняет зеленые кнопки на обычные на главной странице
watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }));
});

watch(filters, fetchItems);
watch(currentPage, fetchItems);
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" alt="/" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск"
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <!-- Прокидывание пропсов  @addToFavorite="addToFavorite"-->
    <CardList
      :meta="meta"
      :items="items"
      @on-click-page="onClickPage"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddPlus"
    />
  </div>
</template>
