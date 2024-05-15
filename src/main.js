import "./assets/main.css";

import {
    autoAnimatePlugin
} from "@formkit/auto-animate/vue";
import {
    createApp
} from "vue";
import App from "./App.vue";

import {
    createRouter,
    createWebHistory
} from "vue-router";

import Home from "./pages/Home.vue";
import Favorites from "./pages/Favorites.vue";
import Profile from "./pages/Profile.vue";



const routes = [{
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/favorites",
        name: "Favorites",
        component: Favorites,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

// import the package
import VueAwesomePaginate from "vue-awesome-paginate";

// import the necessary css file
import "vue-awesome-paginate/dist/style.css";

// Register the package
app.use(VueAwesomePaginate);

app.use(router);
app.use(autoAnimatePlugin);

app.mount("#app");