<template>
  <v-card>
    <v-data-table
        :headers="headers"
        :items="cars"
        :search="search"
    >
      <template v-slot:item.color="{ item }">
<!--        {{item.color}}-->
        <v-chip :color="getColor(item.color)" dark style="min-width: 100px"></v-chip>
      </template>
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
          <v-toolbar-title>Zarządzanie autami</v-toolbar-title>
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
              <v-btn @click="editItem({})" color="primary" dark class="mb-2" v-on="on">Nowe auto</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Auto</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.brand" label="Marka"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.model" label="Model"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="editedItem.color"
                          :items="colorList"
                          :item-text="item => item.name"
                          item-value="value"
                          label="Kolor"
                          return-object
                          single-line
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.year" label="Rok"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Anuluj</v-btn>
                <v-btn v-show="newCar" color="blue darken-1" text @click="save()">Zapisz</v-btn>
                <v-btn v-show="!newCar" color="blue darken-1" text @click="edit()">Zatwierdź</v-btn>
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
import endpoint from "../../../enpoint.json";

export default {
  data() {
    return {
      dialog: false,
      search: '',
      newCar: null,
      headers: [
        {text: 'Marka', value: 'brand'},
        {text: 'Model', value: 'model'},
        {text: 'Kolor', value: 'color'},
        {text: 'Rok', value: 'year'},
        {text: 'Edytuj', value: 'edit'},
      ],
      cars: [],
      colorList: [
        {name: 'Żółty', value:'yellow'},
        {name: 'Zielony', value:'green'},
        {name: 'Czarny', value:'black'},
        {name: 'Niebieski', value:'blue'},
        {name: 'Czerwony', value:'red'},
        {name: 'Biały', value:'white'},
      ],
      editedIndex: -1,
      editedItem: {
        brand: '',
        model: '',
        color: '',
        year: '',
      },
      defaultItem: {
        brand: '',
        model: '',
        color: '',
        year: '',
      },
      car: {
        brand: null,
        model: '',
        color: '',
        year: '',
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.getCars()
  },
  methods: {
    getCars() {
      axios.get(`${endpoint.url}/cars`)
          .then(response => {
            this.cars = response.data

          })
          .catch(() => {

          })
    },
    getColor(color) {
      return color.toLowerCase()
    },
    editItem(item) {

      this.newCar = item.id === undefined;

      this.editedIndex = this.cars.indexOf(item)
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
        brand: this.editedItem.brand,
        model: this.editedItem.model,
        color: this.editedItem.color.value,
        year: this.editedItem.year,
      }

      axios.post(`${endpoint.url}/cars`, data)
          .then(() => {
            this.getCars();
            this.close();
          })
          .catch(() => {

          })

    },
    edit() {

      let data = {
        id: this.editedItem.id,
        brand: this.editedItem.brand,
        model: this.editedItem.model,
        color: this.editedItem.color.value,
        year: this.editedItem.year,
      }

      axios.put(`${endpoint.url}/cars/${data.id}`, data)
          .then(() => {
            this.getCars();
            this.close();
          })
          .catch(() => {

          })

    }
  }
}
</script>
