<template>
  <v-card>
    <v-alert
        v-show="alertShow"
        border="top"
        color="indigo lighten-2"
        dark
    >
      Operacja zakończona pomyślnie
    </v-alert>
    <v-data-table
        :headers="headers"
        :items="rentCars"
        :search="search"
    >
      <template v-slot:item.rentDate="{ item }">
        <span>{{ new Date(item.rentDate).toLocaleString() }}</span>
      </template>


      <template v-slot:item.rented="{ item }">
        <v-chip style="min-width: 100px;text-align: center;display: block" :color="item.rented ? 'red' : 'green'" dark>{{ item.rented ? 'Wypożyczony' : 'Wolny' }}</v-chip>
      </template>
      <template v-slot:item.returnCar="{ item }">
        <v-icon
            small
            v-show="item.rented"
            class="mr-2"
            @click="returnCar(item)"
        >
          mdi-circle-edit-outline
        </v-icon>
      </template>
      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Wyszukiwanie dla frazy "{{ search }}" niczego nie znalazło
      </v-alert>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Zarządzanie wypożyczeniami</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-text-field
              v-model="search"
              label="Szukaj"
              single-line
              hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn @click="editItem({})" color="primary" dark class="mb-2" v-on="on">Nowe wypożyczenie</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Wypożyczenie</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-date-picker v-model="editedItem.rentDate"></v-date-picker>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                          v-model="selectUser"
                          :items="userList"
                          :item-text="item => item.firstname + ' ' + item.lastname"
                          item-value="id"
                          label="Użytkownik"
                          return-object
                          single-line
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                          v-model="selectCar"
                          :items="carList"
                          :item-text="item => item.brand + ' ' + item.model"
                          item-value="id"
                          label="Auto"
                          return-object
                          single-line
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Anuluj</v-btn>
                <v-btn v-show="newRent" color="blue darken-1" text @click="save()">Zapisz</v-btn>
                <v-btn v-show="!newRent" color="blue darken-1" text @click="returnCar()">Zatwierdź</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

    </v-data-table>
  </v-card>

</template>

<script>
import axios from 'axios'
import endpoint from '../../../enpoint.json'

export default {
  data() {
    return {
      dialog: false,
      alertShow: false,
      search: '',
      newRent: null,
      headers: [
        {text: 'Data wypożyczenia', value: 'rentDate'},
        {text: 'Status', value: 'rented'},
        {text: 'Nazwa użytkownika', value: 'userString'},
        {text: 'Nazwa auta', value: 'carString'},
        {text: 'Zwrot auta', value: 'returnCar'},
      ],
      rentCars: [],
      userList: [],
      selectUser: {},
      selectCar: {},
      carList: [],
      editedIndex: -1,
      editedItem: {
        rentDate: '',
        rented: '',
        idUser: '',
        idCar: '',
      },
      defaultItem: {
        rentDate: '',
        rented: '',
        idUser: '',
        idCar: '',
      },
      rentCar: {
        rentDate: null,
        rented: '',
        idUser: '',
        idCar: '',
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.getRents();
    this.getUsers();
    this.getCars();
  },
  methods: {
    getCars() {
      axios.get(`${endpoint.url}/cars`)
          .then(response => {
            this.carList = response.data
          })
          .catch(() => {

          })
    },
    getUsers() {
      axios.get(`${endpoint.url}/users`)
          .then(response => {
            this.userList = response.data
          })
          .catch(() => {

          })
    },
    getRents() {
      axios.get(`${endpoint.url}/rents`)
          .then(response => {
            this.rentCars = response.data
          })
          .catch(() => {

          })
    },
    editItem(item) {

      this.newRent = item.id === undefined;

      this.editedIndex = this.rentCars.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {

      let data = {
        rentDate: this.editedItem.rentDate,
        idUser: this.selectUser.id,
        idCar: this.selectCar.id,
      }

      axios.post(`${endpoint.url}/rents/${data.idUser}/${data.idCar}`, data)
          .then(() => {
            this.getRents();
            this.close();
            this.alertShow = true;
            this.selectUser = {}
            this.selectCar = {}
            setTimeout(() => {
              this.alertShow = false
            },5000)

          })
          .catch(() => {

          })

    },
    returnCar(item) {

      let data = {
        id: item.id,
        rentDate: item.rentDate,
        rented: item.rented,
        idUser: item.idUser,
        idCar: item.idCar,
      }

      axios.post(`${endpoint.url}/rents/returnCar/${data.id}`, data)
          .then(() => {
            this.getRents();
            this.close();
            this.alertShow = true;
            setTimeout(() => {
              this.alertShow = false
            },5000)
          })
          .catch(() => {

          })

    }
  }
}
</script>
