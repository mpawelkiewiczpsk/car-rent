<template>
  <v-app id="inspire">
    <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
    >
      <v-list dense>
        <template v-for="item in items">

          <v-list-item
                  :key="item.text"
                  link
                  @click="$router.push(item.link)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
    >
      <v-toolbar-title
              style="width: 300px"
              class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Wypożyczalnia</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.native="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container
              fluid
      >
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'mdi-anchor', text: 'Strona główna', link: '/dashboard' },
        { icon: 'mdi-contacts', text: 'Użytkownicy', link: '/dashboard/users' },
        { icon: 'mdi-car-info', text: 'Samochody', link: '/dashboard/cars' },
        { icon: 'mdi-car-key', text: 'Wypożyczenia', link: '/dashboard/rentCar' },
      ],
    }),
    methods: {
      logout() {
        sessionStorage.removeItem("loggedIn")
        this.$router.push("/")

        axios.get(`/php_api/User/logout.php`)
                .then(() => {
                  sessionStorage.removeItem("loggedIn")
                  this.$router.push("/")
                })
                .catch( () => {

                } )
      }
    }
  }
</script>
