<script setup>
import { onMounted, provide, reactive, ref, watch, computed } from "vue";
import axios from "axios";

import Header from "./components/Header.vue";
import CardList from "./components/CardList.vue";
import Drawer from "./components/Drawer.vue";

// Хранятся все кроссовки(массив)
const items = ref([]);
// Создаем массив в котором будет храниться спимок товаров в корзине
const cart = ref([]);
//Переменная для 'заказ на оформлении'
const isCreatinOrder = ref(false);

const user = ref([]);
// Итого
const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0));
// Процент
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100));

//Если корзина пустая
const cartIsEmpty = computed(() => cart.value.length === 0);

// // Кнопка сделать заказ серая(Disabled) если isCreatinOrder==true или корзина пустая
const cartButtonDisabled = computed(() => isCreatinOrder.value || cartIsEmpty.value);

const drawerOpen = ref(false);
// функция закрывает окошко корзины
const closeDrawer = () => {
  drawerOpen.value = false;
};
// функция открывает окошко корзины
const openDrawer = () => {
  drawerOpen.value = true;
};

// Сортировка товаров(sortBy-выпадающее меню,searchQuert - за инпут(поиск))
// Хранит фильтры
const filters = reactive({
  sortBy: "title",
  searchQuert: "",
});

// Функция которая добавляет товары в корзину
const addToCart = (item) => {
  cart.value.push(item);
  item.isAdded = true;
};
// Удаляем товар из корзины(с помощью метода splice мы находим индекс этого item и
// удалить один элемент )
const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1);
  item.isAdded = false;
};
// Создаем заказ на бэк
const createOrder = async () => {
  try {
    isCreatinOrder.value = true;
    const { data } = await axios.post(`https://290dddb232f0bb1a.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: totalPrice.value,
    });
    cart.value = [];

    return data;
  } catch (err) {
    console.log(err);
  } finally {
    isCreatinOrder.value = false;
  }
};

// функция вызывается при клике на кнопку добавить в корзину
const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

// Функции следят за изменением селекта и инпута
const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};
const onChangeSearchInput = (event) => {
  filters.searchQuert = event.target.value;
};
// Функции следят за изменением селекта и инпута

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
      const favorite = favorites.find((favorite) => favorite.parentId === item.id);
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

// Когда хотим добавить товар в закладку
const addToFavorite = async (item) => {
  try {
    // Проверяем был ли добавлен этот товар
    if (!item.isFavorite) {
      // Если нет, то создаем этот товар
      const obj = {
        parentId: item.id,
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

// Функция при каждом изменении элементов или при первом рендере, выполняет запрос на бэк
// запрашивает только списак товаров
const fetchItems = async () => {
  try {
    // по умолчанию сортировка sortBy: "title",
    const params = {
      sortBy: filters.sortBy,
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
    items.value = data.map((obj) => ({
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

// Вспомогательная функция, которая отлавливает что поменялось(сортировка товаров)(изменение фильтрации)
watch(filters, fetchItems);
watch(user, showUserFavorites);

// следит за изменением корзины и при клике на кнопку отправить заказ меняет зеленые кнопки на обычные на главной странице
watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }));
});

// чтобы после перезагрузки страницыинфо в карточках не менялась(например товары в корзине)
// любое изменение корзины сохраняется в локал сторедж
watch(
  cart,
  () => {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  },
  { deep: true } // глубокая проверка
);

// Обьявляем что есть  2 функции внутри обьекта cartActions(которую можем использовать
// в любом другом месте ТОЛЬКО В ДОЧЕРНИХ элементах)

provide("cart", {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
});
//Ключи у provide должны быть уникальными(первое значение в скобках)
</script>
<template>
  <!--рендерится только в том случае если drawerOpen=true-->
  <Drawer
    :total-price="totalPrice"
    :vatPrice="vatPrice"
    v-if="drawerOpen"
    @create-order="createOrder"
    :button-disabled="cartButtonDisabled"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <!-- предаем пропсы(указываем сами события в пропсах) называем кебаб-кейс(open-drawer) -->
    <Header
      :total-price="totalPrice"
      @open-drawer="openDrawer"
      @fetchUsers="fetchUsers"
      :user="user.name"
    />

    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

        <div class="flex gap-4">
          <select
            @change="onChangeSelect"
            class="py-2 px-3 border rounded-md outline-none"
          >
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
          :items="items"
          @add-to-favorite="addToFavorite"
          @add-to-cart="onClickAddPlus"
        />
      </div>
    </div>
  </div>
</template>
