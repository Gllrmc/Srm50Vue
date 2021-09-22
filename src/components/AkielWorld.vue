<template> 
  <v-container>
        <template>
            <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                absolute
                bottom
                app
                right
                :color="snackcolor"
                >
                {{ snacktext }}
                <template v-slot:action="{ attrs }">
                    <v-btn 
                        color="#FFFFFF"
                        dark
                        vertical
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                    >
                        Cerrar
                    </v-btn>
                </template>
            </v-snackbar>
        </template>
        <v-layout
          justify-center
        >
          <v-card
            width=400
            tile
            flat
          >
            <v-col cols="12" sm="12" md="12">
              <v-img
                width=550
                src="data:image/png;base64,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"
                aspect-ratio="1.2"
                contain
              >
              </v-img>
            </v-col>

            <v-card-text>
              <div>
                <p class="title text-center">Contactos:<br>
                <p class="font-weight-light text-center">
                  Comercial: Lucio Andres: +54 (911) 3561-4639<br>
                  Sistemas: Guillermo Cristobal: +54 (911) 3560-0383<br>
                  o consulte online nuestra <a href="https://akiel.com.ar" target="_blank">Pagina Web</a>
                </p>
              </div>
            </v-card-text>
          </v-card>
          <v-dialog v-model="dialog" max-width="600px" persistent>
            <v-toolbar
              color="indigo"
              dark
            >
              <v-app-bar-nav-icon></v-app-bar-nav-icon>
              <v-toolbar-title>Cambio de Password Requerido</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>verified_user</v-icon>
              </v-btn>
            </v-toolbar>
              <v-card>
              <v-card-title>
                  <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                  <v-container grid-list-md>
                      <v-row dense>
                          <v-col cols="12" sm="12" md="12">
                              <v-text-field type="password" v-model="actualpassword" label="Password Actual">
                              </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                              <v-text-field type="password" v-model="password" label="Nueva Password" required>
                              </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                              <v-text-field type="password" v-model="retypepassword" label="Confirmar Password" required>
                              </v-text-field>
                          </v-col>
                      </v-row>
                      <v-col cols="12" sm="12" md="12" v-show="valida">
                          <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                          </div>
                      </v-col> 
                  </v-container>
              </v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="salir">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
              </v-card-actions>
              </v-card>
          </v-dialog>
      </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {

name: 'AkielWorld',

    data: () => {
      return {
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        actualpassword: '',
        password: '',
        retypepassword: '',
        dialog: false,
        validaMensaje: [],
        valida: 0
      }
    },
    watch: {
      dialog (val) {
      val || this.closeForm()
        },
      },
      created () {
        this.inicializar();
      },
    methods:{
      
      inicializar(){
        let me=this;
        me.dialog=me.$store.state.usuario.pxch=="SI"?true:false;
        me.actualpassword="";
        me.password="";
        me.retypepassword="";
      },
      salir(){
        this.$store.dispatch("salir");
      },
      closeForm(){
        this.dialog=false;
      },
      guardar(){
        let me=this;
        if (this.validar()){
            return;
        }
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};
        axios.put('api/Usuarios/Pxch',{
            'Id':me.$store.state.usuario.idusuario,
            'oldpassword':me.actualpassword,
            'newpassword':me.password,
        },configuracion).then(() => {
            me.salir();
        }).catch(function(error){
            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
            me.snackbar = true;
            me.snackcolor = 'error'
            console.log(error);
        });
      },
      validar(){
        this.valida=0;
        this.validaMensaje=[];

        if (this.password !== this.retypepassword){
            this.validaMensaje.push("No hay coincidencia en la verificacacón de Passwords.");
        }
        if (this.password.length<6){
            this.validaMensaje.push("El password debe poseer al menos 6 caracteres alfanumericos y/o especiales.");
        }
        if (this.validaMensaje.length){
            this.valida=1;
        }
        return this.valida;

      },
    },
  }
</script>