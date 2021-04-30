<template>
  <v-card>
    <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
    >
      <template v-slot:item.edit="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-circle-edit-outline
        </v-icon>
      </template>
      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Wyszukiwanie dla frazy "{{ search }}" niczego nie znalazło
      </v-alert>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Zarządzanie użytkownikami</v-toolbar-title>
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
            <v-btn @click="editItem({})" color="primary" dark class="mb-2">Nowy użytkownik</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Użytkownik</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.firstname" label="Imię"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.lastname" label="Nazwisko"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" label="email"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.city" label="Miasto"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.street" label="Ulica"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.buildingNumber" label="Numer domu"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Anuluj</v-btn>
              <v-btn v-show="newUser" color="blue darken-1" text @click="save()">Zapisz</v-btn>
              <v-btn v-show="!newUser" color="blue darken-1" text @click="edit()">Zatwierdź</v-btn>
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
      search: '',
      newUser: null,
      headers: [
        {text: 'Id', value: 'id'},
        {text: 'Imię', value: 'firstname'},
        {text: 'Nazwisko', value: 'lastname'},
        {text: 'Email', value: 'email'},
        {text: 'Miasto', value: 'city'},
        {text: 'Ulica', value: 'street'},
        {text: 'Numer domu', value: 'buildingNumber'},
        {text: 'Edytuj', value: 'edit'},
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        firstname: '',
        lastname: '',
        email: '',
        city: '',
        street: '',
        buildingNumber: ''
      },
      defaultItem: {
        firstname: '',
        lastname: '',
        email: '',
        city: '',
        street: '',
        buildingNumber: ''
      },
      user: {
        firstname: null,
        lastname: '',
        email: '',
        city: '',
        street: '',
        buildingNumber: ''
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      axios.get(`${endpoint.url}/users`)
          .then(response => {
            this.users = response.data
          })
          .catch(() => {

          })
    },
    editItem(item) {

      this.newUser = item.id === undefined;

      this.editedIndex = this.users.indexOf(item)
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
        id: this.editedItem.id,
        firstname: this.editedItem.firstname,
        lastname: this.editedItem.lastname,
        email: this.editedItem.email,
        buildingNumber: this.editedItem.buildingNumber,
        street: this.editedItem.street,
        city: this.editedItem.city,
      }

      axios.post(`${endpoint.url}/users`, data)
          .then(() => {
            this.getUsers();
            this.close();
          })
          .catch(() => {

          })

    },
    edit() {

      let data = {
        id: this.editedItem.id,
        firstname: this.editedItem.firstname,
        lastname: this.editedItem.lastname,
        email: this.editedItem.email,
        buildingNumber: this.editedItem.buildingNumber,
        street: this.editedItem.street,
        city: this.editedItem.city,
      }

      axios.put(`${endpoint.url}/users/${data.id}`, data)
          .then(() => {
            this.getUsers();
            this.close();
          })
          .catch(() => {

          })

    }
  }
}
</script>
