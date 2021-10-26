<template>
    <v-row align="start">
        <template>
            <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                absolute
                top
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
                        CLOSE
                    </v-btn>
                </template>
            </v-snackbar>
        </template>
        <v-col cols="12" md="12" sm="12">
            <v-data-table
            dense
            :headers="headers"
            :items="roles"
            :search="search"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>mdi-printer</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Roles</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-dialog v-model="adModal" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Rol?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Bloquear Rol?</v-card-title>
                                <v-card-text>
                                    You are about to
                                    <span v-if="adAccion==1">Activate </span>
                                    <span v-if="adAccion==2">Inactivate </span>
                                    the Role: {{ adNombre }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer/>
                                    <v-btn small @click="activarDesactivarCerrar">Cancel
                                    <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn small v-if="adAccion==1" @click="activar">Activate
                                    <v-icon>mdi-lock-open</v-icon>
                                    </v-btn>
                                    <v-btn small v-if="adAccion==2" @click="desactivar">Inactivate
                                    <v-icon>mdi-lock</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>                </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <template v-if="item.activo">
                                <v-icon
                                class="mr-2"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(2,item)"
                                >
                                mdi-eye-off
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                class="mr-2"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(1,item)"
                                >
                                mdi-eye
                                </v-icon>
                            </template>
                        </template>
                        <span>Act/Ina</span>
                    </v-tooltip>
                </template>
                <template v-slot:[`item.activo`]="{ item }">
                    <td>
                        <div v-if="item.activo">
                            <v-chip class="ma-2" color="primary" text-color="white">Active</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2">Dormant</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar">Reset</v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
  export default {
    data: () => ({
        snackbar:false,
        snacktext: '',
        snackcolor:'',
        timeout: 4000,
        roles: [],
        dialog: false,
        headers: [
            { text: 'Role', value: 'nombre', align: 'start', sortable: true },
            { text: 'Description', value: 'nombre', align: 'start', sortable: true },
            { text: 'Status', value: 'activo', align: 'start', sortable: false  },
            { text: '[Options]', value: 'actions', align: 'center', sortable: false },
        ],
        search:'',
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
    },

    watch: {
    },

    created () {
      this.listar()
    },

    methods: {
        crearPDF(){
            var columns = [
                    {title: "Role", dataKey: "nombre"},
                    {title: "Description", dataKey: "descripcion"},
                    {title: "Active", dataKey: "activo"}
            ];
            var rows = [];

            this.roles.map(function(x){
                    rows.push({nombre:x.nombre,descripcion:x.descripcion,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            const doc = new jsPDF();
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Roles", 40, 30);
                }
            })
            doc.save('Roles.pdf')
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Roles/Listar',configuracion).then(function(response){
                //console.log(response);
                me.roles=response.data;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = "error"
                console.log(error);
            });
        },
        activarDesactivarMostrar(accion,item){
            this.adModal=1;
            this.adNombre=item.nombre;
            this.adId=item.id;                
            if (accion==1){
                this.adAccion=1;
            }
            else if (accion==2){
                this.adAccion=2;
            }
            else{
                this.adModal=0;
            }
        },
        activarDesactivarCerrar(){
            this.adModal=0;
        },
        activar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Roles/Activar/'+this.adId,{},configuracion).then(function(){
                me.snacktext = 'Activated';
                me.snackcolor = "success";
                me.snackbar = true;
                me.adModal=0;
                me.adAccion=0;
                me.adNombre="";
                me.adId="";
                me.listar();                       
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = "error"
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Roles/Desactivar/'+this.adId,{},configuracion).then(function(){
                me.snacktext = 'Inactivated';
                me.snackcolor = "success";
                me.snackbar = true;
                me.adModal=0;
                me.adAccion=0;
                me.adNombre="";
                me.adId="";
                me.listar();                       
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = "error"
                console.log(error);
            });
        }
    }
  }
</script>
