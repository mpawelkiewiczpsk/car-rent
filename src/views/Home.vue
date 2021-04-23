<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-alert
              v-show="info.length > 0"
              border="top"
              color="red lighten-2"
              dark
            >
              {{ info }}
            </v-alert>
            <v-card class="elevation-12">

              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Formularz logowania</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form ref="login" v-model="valid">
                  <v-text-field
                    label="Login"
                    name="login"
                    type="text"
                    :rules="notEmptyRule"
                    v-model="login"
                  />

                  <v-text-field
                    id="password"
                    label="Hasło"
                    name="password"
                    type="password"
                    :rules="notEmptyRule"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="!valid" @click.native="submit">Zaloguj</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
  import axios from 'axios'
  import endpoint from '../../endpoint.json'
  export default {
    data() {
      return{
        notEmptyRule: [
          v => !!v || 'To pole jest wymagane'
        ],
        login: null,
        password: null,
        valid: false,
        info: ''
      }
    },
    methods: {
      submit() {
        if(this.$refs.login.validate()){
          this.loginToSystem();
        }
      },
      loginToSystem() {
        axios.get(`${endpoint.url}/login/${this.login}`)
        .then(response => {
          if(response.status === 200){
            sessionStorage.setItem('loggedIn', this.login)
            sessionStorage.setItem('loginName', response.data.firstname)
            sessionStorage.setItem('loginLastName', response.data.lastname)
            this.$router.push('/dashboard')
          }
        })
        .catch( () => {
          this.info = 'Niepoprawne dane do logowania'
        })
      }
    }
  }
</script>
