<template>
    <v-row align="start">
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
                        CLOSE
                    </v-btn>
                </template>
            </v-snackbar>
        </template>
        <v-col cols="12" md="12" sm="12">
            <v-data-table
            dense
            :headers="headersusuarios"
            :items="usuarios"
            :search="searchu"
            class="elevation-1 blue-grey lighten-5"
            no-data-text="Nothing to show"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>mdi-printer</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Artists</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field dense label="Search" outlined v-model="searchu" clearable append-icon="mdi-magnify" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="600px">
                            <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">NEW</v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container
                                    class="grey lighten-5"
                                    grid-list-md>
                                    <v-row dense>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense v-model="nombre" label="First Name" counter="100">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense v-model="apellido" label="Last Name" counter="100">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense v-model="iniciales" v-mask="up3" label="Initials" counter="3"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select dense v-model="rolid"
                                            :items="roles" label="Role">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense v-model="email" label="Email" counter="50">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense type="password" v-model="password" label="Password">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field dense v-model="telefono" label="Mobile" counter="20">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols=12 sm=6 md=6>
                                            <v-select dense v-model="lineaspag" :items="lineaspags" label="# rows per page"></v-select>
                                        </v-col>
                                        <v-col cols=12 sm=6 md=6>
                                            <v-select dense v-model="coltexto" :items="textos" label="Text color"></v-select>
                                        </v-col>
                                        <v-col cols=12 sm=6 md=6>
                                            <v-select dense v-model="colfondo" :items="colores" label="Back color"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-avatar class="ml-2" v-if="coltexto=='black'" :color="colfondo" size=40>
                                                <span style="color:black">{{ iniciales }}</span>
                                            </v-avatar>
                                            <v-avatar class="ml-2" v-else :color="colfondo" size=40>
                                                <span style="color:white">{{ iniciales }}</span>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="12" sm="2" md="2">
                                            <v-layout column>
                                                <v-avatar class="ml-2" size=40>
                                                    <v-img :src="imageUrl" aspect-ratio="2" contain></v-img>
                                                </v-avatar>
                                                <input v-show="false" ref="inputUpload1" type="file" @change="onFilePicked" >
                                            </v-layout>
                                        </v-col>
                                        <v-col cols="12" sm="4" md="4">
                                            <v-btn class="mx-2" small fab color="primary" @click="$refs.inputUpload1.click()">
                                                <v-icon dense dark>
                                                    mdi-plus
                                                </v-icon>    
                                            </v-btn>
                                            <v-btn class="mx-2" small fab color="primary" @click="clearImagen">
                                                <v-icon dense dark>
                                                    mdi-delete
                                                </v-icon>    
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="6">
                                            <v-switch  dense v-model="pxch" class="mx-2" label="Change password"></v-switch>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12" v-show="valida">
                                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="close">Cancelar</v-btn>
                                <v-btn color="primary" text @click="guardar">Guardar</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="adModal" max-width="390">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Miembro?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Bloquear Miembro?</v-card-title>
                                <v-card-text>
                                    You are about to
                                    <span v-if="adAccion==1">Activate </span>
                                    <span v-if="adAccion==2">Inactivate </span>
                                    the team member: {{ adNombre }}
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
                        </v-dialog>
                        <v-dialog v-model="recordInfo" max-width="400">
                            <v-card>
                                <v-card-title class="headline">Item info</v-card-title>
                                <v-card-text>
                                    <p><b>Created by:</b></p>
                                    {{iduseralta}}<br>
                                    {{fecalta}}
                                    <p/>
                                    <p><b>Last updated by':</b></p>
                                    {{iduserumod}}<br>
                                    {{fecumod}}<br>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer/>
                                    <v-btn small @click="recordInfo=false">Exit
                                    <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip 
                        bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="editItem(item)"
                            >
                            mdi-pencil
                            </v-icon>
                        </template>
                        <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarGrupos(item)"
                            >
                            mdi-account-group
                            </v-icon>
                        </template>
                        <span>Grupos</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarProyectos(item)"
                            >
                            mdi-sprout
                            </v-icon>
                        </template>
                        <span>Proyectos</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteItem(item)"
                            >
                            mdi-delete
                            </v-icon>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
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
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="infoItem(item)"
                            >
                            mdi-information-outline
                            </v-icon>
                        </template>
                        <span>Info</span>
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
                <template v-slot:[`item.imgusuario`]="{ item }">
                    <td>
                        <div v-if="item.imgusuario">
                            <v-avatar size=40>
                                <v-img :src="item.imgusuario" aspect-ratio="2" contain></v-img>
                            </v-avatar>
                        </div>
                        <div v-else>
                            <v-avatar v-if="item.coltexto=='black'" :color="item.colfondo" size=40>
                                <span style="color:black">{{ item.iniciales }}</span>
                            </v-avatar>
                            <v-avatar v-else :color="item.colfondo" size=40>
                                <span style="color:white">{{ item.iniciales }}</span>
                            </v-avatar>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.fecalta`]="{ item }">
                    <td>{{ item.fecalta.substr(0, 16) }}</td>
                </template>
                <template v-slot:[`item.fecumod`]="{ item }">
                    <td>{{ item.fecumod.substr(0, 16) }}</td>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar">Reset</v-btn>
                </template>
            </v-data-table>
        </v-col>
        <v-col cols="12" md="6" sm="3">
            <v-dialog v-model="groupdialog" max-width="750px">
                <v-data-table
                dense
                :headers="headersgrupos"
                :items="grupos"
                :search="searchg"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{groupheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field label="Search" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searchg" 
                                        append-icon="mdi-magnify" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="5" sm="5">
                                        <v-text-field 
                                            label="Agregar grupo"
                                            class="ma-2"
                                            outlined 
                                            dense 
                                            hide-details
                                            v-model="addgroup"
                                            clearable
                                            counter="50"
                                            append-icon="mdi-plus-circle"
                                            @click:append="agregarGrupo(addgroup)"
                                            ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="groupdialog=false">Salir</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionGrupo(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary" @click="listar">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-dialog>
            <v-dialog v-model="proydialog" max-width="750px">
                <v-data-table
                dense
                :headers="headersproyectos"
                :items="proyectos"
                :search="searchp"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{proyheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="8" sm="8">
                                        <v-text-field label="Search" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searchp" 
                                        append-icon="mdi-magnify" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="proydialog=false">Salir</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionProyecto(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:[`item.tarifaproyectousuario`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.tarifaproyectousuario"
                            large
                            cancel-text="Exit"
                            save-text="Save"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.tarifaproyectousuario }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.tarifaproyectousuario"
                                type="number"
                                label="Edit"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.costoproyectousuario`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.costoproyectousuario"
                            large
                            cancel-text="Exit"
                            save-text="Save"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.costoproyectousuario }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.costoproyectousuario"
                                type="number"
                                label="Edit"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.notas`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.notas"
                            large
                            cancel-text="Exit"
                            save-text="Save"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.notas }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.notas"
                                counter="256"
                                label="Edit"
                                single-line
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>                    

                    <template v-slot:no-data>
                        <v-btn color="primary" @click="listar">Reset</v-btn>
                    </template>
                </v-data-table>
            </v-dialog>
        </v-col>        
    </v-row>
</template>
<script>
  import axios from 'axios'
  import jsPDF from 'jspdf'
  export default {
    data: () => ({
        rules: {
            counter: value => value.length >= 3 && value.length <= 50  || 'Min 3 Max 50 characters'
        },
        up3:'AAA',
        colores: [
            {value: '#F44336', text: 'Rojo'},
            {value: '#E91E63', text: 'Rosa'},
            {value: '#9C27B0', text: 'Violeta'},
            {value: '#673AB7', text: 'Violeta oscuro'},                    
            {value: '#3F51B5', text: 'Indigo'},
            {value: '#2196F3', text: 'Azul'},
            {value: '#03A9F4', text: 'Celeste'},
            {value: '#00BCD4', text: 'Cianico'},
            {value: '#009688', text: 'Turquesa'},
            {value: '#4CAF50', text: 'Verde'},
            {value: '#8BC34A', text: 'Verde claro'},                    
            {value: '#CDDC39', text: 'Lima'},
            {value: '#FFEB3B', text: 'Amarillo'},
            {value: '#FFC107', text: 'Ambar'},
            {value: '#FF9800', text: 'Naranja'},
            {value: '#FF5722', text: 'Naranja oscuro'},
            {value: '#795548', text: 'Marron'},
            {value: '#607D8B', text: 'Lívido'},
            {value: '#9E9E9E', text: 'Gris'},
            {value: '#000000', text: 'Negro'},
            {value: '#FFFFFF', text: 'Blanco'}
        ],
        textos: [
            {value: 'white', text: 'Blanco'},
            {value: 'black', text: 'Negro'},
        ],
        lineaspags: [
            {value: 5, text: "5"},
            {value: 10, text: "10"},
            {value: 15, text: "15"},
            {value: -1, text: "All"},
        ],
        primerahoras: [
            {value: 300, text: "05:00"},
            {value: 360, text: "06:00"},
            {value: 420, text: "07:00"},
            {value: 480, text: "08:00"},
            {value: 540, text: "09:00"},
            {value: 600, text: "10:00"},
            {value: 660, text: "11:00"},
            {value: 720, text: "12:00"},
        ],
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        usuarios: [],
        roles:[],
        grupos:[],
        proyectos:[],
        grupousuarios:[],
        proyectousuarios:[],
        workuserId:'',
        imageUrl:'',
        groupheader: '',
        proyheader: '',
        dialog: false,
        groupdialog: false,
        proydialog: false,
        searchg: '',
        searchu: '',
        searchp: '',
        editedIndex: -1,
        id: '',
        rolid:'',
        iniciales:'',
        nombre:'',
        apellido:'',
        telefono: '',
        email: '',
        password:'',
        colfondo:'#000000',
        coltexto:'black',
        imgusuario:'',
        lineaspag: 0,
        pxch:false,
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        addgroup: '',
        addproy: '',
        actPassword:false,
        passwordAnt:'',
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
        headersusuarios(){
            return [
                { text: 'Avatar', value: 'imgusuario', align: 'center', sortable: false },
                { text: 'eMail', value: 'email', align: 'start', sortable: true },
                { text: 'First Name', value: 'nombre', align: 'start', sortable: true },
                { text: 'Last Name', value: 'apellido', align: 'start', sortable: true },
                { text: 'Initials', value: 'iniciales', align: 'start', sortable: true },
                { text: 'Rol', value: 'rol', align: 'start', sortable: true },
                { text: 'Row/Pag', value: 'lineaspag', align: 'start', sortable: true },
                { text: 'Phone', value: 'telefono', align: 'start', sortable: true },
                { text: 'Status', value: 'activo', align: 'start', sortable: true  },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false },
            ]
        },
        headersgrupos(){
            return [
                { text: '#', value: 'selected', align: 'center', sortable: false },
                { text: 'Nombre grupo', value: 'nombre', align: 'start', sortable: true },
            ]
        },
        headersproyectos(){
            return [
                { text: '#', value: 'selected', align: 'center', sortable: false },
                { text: 'Proyecto', value: 'nombre', align: 'start', sortable: true },
                { text: 'Tarifa', value: 'tarifaproyectousuario', align: 'end', sortable: true },
                { text: 'Costo', value: 'costoproyectousuario', align: 'end', sortable: true },
                { text: 'Notas', value: 'notas', align: 'start', sortable: true },
            ]
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New team member' : 'Update team member'
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.select();
        this.listar()
    },

    methods: {
        save () {
        },
        cancel () {
        },
        pickFile () {
            this.$refs.image.click ()
        },
        onFilePicked (e) {
            const files = e.target.files
            if (files[0] !== undefined) {
                this.imageName = files[0].name
                if (this.imageName.lastIndexOf('.') <= 0) {
                return
                }
                const fr = new FileReader ()
                fr.readAsDataURL(files[0])
                fr.addEventListener('load', () => {
                    this.imageUrl = fr.result
                    this.imageFile = files[0] // this is an image file that can be sent to server...
                    this.imgusuario = this.imageUrl;
                })
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        clearImagen(){
            this.imageUrl = ''
            this.imgusuario = ''
        },
        crearPDF(){
            var columns = [
                    {title: "Initials", dataKey: "iniciales"},
                    {title: "First Name", dataKey: "nombre"},
                    {title: "Last Name", dataKey: "apellido"},
                    {title: "Rol", dataKey: "rol"},
                    {title: "eMail", dataKey: "email"},
                    {title: "Phone", dataKey: "telefono"},
                    {title: "Active", dataKey: "activo"}
            ];
            var rows = [];

            this.usuarios.map(function(x){
                    rows.push({iniciales:x.iniciales,nombre:x.nombre,apellido:x.apellido,rol:x.rol,telefono:x.telefono,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Team List", 40, 30);
                }
            });
            doc.save('Team.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                //console.log(response);
                me.usuarios=response.data;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        select(){
            let me=this;
            var rolesArray=[];
            var gruposArray=[];
            var proyectosArray=[];
            var grupousuariosArray=[];
            var proyectousuariosArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Roles/Select',configuracion).then(function(response){
                rolesArray=response.data;
                rolesArray.map(function(x){
                    me.roles.push({text: x.nombre,value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Grupos/Listar',configuracion).then(function(response){
                gruposArray=response.data;
                gruposArray.map(function(x){
                    me.grupos.push({selected: false, nombre: x.nombre, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Grupousuarios/Listar',configuracion).then(function(response){
                grupousuariosArray=response.data;
                grupousuariosArray.map(function(x){
                    me.grupousuarios.push({grupoid: x.grupoid, usuarioid: x.usuarioid, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                proyectosArray=response.data;
                proyectosArray.map(function(x){
                    me.proyectos.push({selected: false, value:x.id, nombre: x.nombre, relid: 0, tarifaproyectousuario: 0, costoproyectousuario: 0, notas: ''});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectousuarios/Listar',configuracion).then(function(response){
                proyectousuariosArray=response.data;
                proyectousuariosArray.map(function(x){
                    me.proyectousuarios.push({proyectoid: x.proyectoid, usuarioid: x.usuarioid, 
                    tarifaproyectousuario: x.tarifaproyectousuario, costoproyectousuario: x.costoproyectousuario, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        editItem (item) {
            this.id=item.id;
            this.rolid=item.rolid;
            this.iniciales=item.iniciales;
            this.nombre=item.nombre;
            this.apellido=item.apellido;
            this.telefono=item.telefono;
            this.email=item.email;
            this.password=item.password_hash;
            this.passwordAnt=item.password_hash;
            this.colfondo=item.colfondo;
            this.coltexto=item.coltexto;
            this.imgusuario=item.imgusuario;
            this.imageUrl=item.imgusuario;
            this.lineaspag=item.lineaspag;
            this.pxch=item.pxch;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;
            this.editedIndex = 1;
            this.groupdialog = false;
            this.proydialog = false;
            this.dialog = true;
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Usuarios/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        infoItem(item){
            var index = this.usuarios.findIndex(x => x.iduseralta === item.iduseralta);
            this.iduseralta=this.usuarios[index].email + ' ' + this.usuarios[index].apellido +' '+ this.usuarios[index].nombre;
            this.fecalta=item.fecalta;
            this.iduserumod=this.usuarios[index].email + ' ' + this.usuarios[index].apellido +' '+ this.usuarios[index].nombre;
            this.fecumod=item.fecumod;
            this.recordInfo = true;
        },
        closeInfo(){
            this.iduseralta='';
            this.fecalta='';
            this.iduserumod='';
            this.fecumod='';
            this.recordInfo = false;
        },
        close () {
            this.dialog = false
            this.limpiar();
        },
        tratarGrupos(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.grupos.length; l++){
                me.grupos[l].selected = false;
            }
            for (let i = 0; i < me.grupousuarios.length; i++){
                if (me.grupousuarios[i].usuarioid === item.id){
                    index = me.grupos.findIndex(elemento => elemento.value === me.grupousuarios[i].grupoid );
                    me.grupos[index].selected = true;
                }
            }
            me.workuserId = item.id;
            me.groupheader = 'Grupos de ' + item.iniciales + ' ' + item.email;
            me.groupdialog=!me.groupdialog;
        },
        tratarProyectos(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.proyectos.length; l++){
                me.proyectos[l].selected = false;
                me.proyectos[l].relid = 0;
                me.proyectos[l].tarifaproyectousuario = 0;
                me.proyectos[l].costoproyectousuario = 0;
                me.proyectos[l].notas = ''
            }
            for (let i = 0; i < me.proyectousuarios.length; i++){
                if (me.proyectousuarios[i].usuarioid === item.id){
                    index = me.proyectos.findIndex(elemento => elemento.value === me.proyectousuarios[i].proyectoid )
                    me.proyectos[index].selected = true;
                    me.proyectos[index].relid = me.proyectousuarios[i].value;
                    me.proyectos[index].tarifaproyectousuario = me.proyectousuarios[i].tarifaproyectousuario;
                    me.proyectos[index].costoproyectousuario = me.proyectousuarios[i].costoproyectousuario;
                    me.proyectos[index].notas = me.proyectousuarios[i].notas;

                }
            }
            me.workuserId = item.id;
            me.proyheader = 'Proyectos vinculados a ' + item.iniciales + ' ' + item.email;
            me.proydialog=!me.proydialog;
        },
        accionGrupo(item){
            var me=this;
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Grupousuarios/Crear',{
                    'grupoid': item.value,
                    'usuarioid': this.workuserId,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.grupousuarios.push({grupoid: response.data.grupoid, usuarioid: response.data.usuarioid, value: response.data.id});
                    //console.log(response);
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            } else {
                var indice = me.grupousuarios.find(x => item.value === x.grupoid && me.workuserId === x.usuarioid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Grupousuarios/Eliminar/'+indice,configuracion).then( () => {
                    me.grupousuarios = me.grupousuarios.filter(x => x.value != indice); 
                    me.snacktext = 'Eliminated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        accionProyecto(item){
            var me=this;
            let index = 0;
            index = me.proyectos.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Proyectousuarios/Crear',{
                    'proyectoid': item.value,
                    'usuarioid': this.workuserId,
                    'tarifaproyectousuario': item.tarifaproyectousuario,
                    'costoproyectousuario': item.costoproyectousuario,
                    'notas': item.notas,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.proyectousuarios.push({proyectoid: response.data.proyectoid, usuarioid: response.data.usuarioid, value: response.data.id});
                    me.proyectos[index].relid = response.data.id;
                    //console.log(response);
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            } else {
                var indice = me.proyectousuarios.find(x => item.value === x.proyectoid && me.workuserId === x.usuarioid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Proyectousuarios/Eliminar/'+indice,configuracion).then( () => {
                    me.proyectousuarios = me.proyectousuarios.filter(x => x.value != indice); 
                    me.proyectos[index].relid = 0;
                    me.proyectos[index].tarifaproyectousuario = 0;
                    me.proyectos[index].costoproyectousuario = 0;
                    me.proyectos[index].notas = '';
                    me.snacktext = 'Eliminated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        editProyecto(item){
            var me=this;
            let index=0;
            index = me.proyectousuarios.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectousuarios/Actualizar',{
                'id':item.relid,
                'usuarioid':this.workuserId,
                'proyectoid':item.value,
                'tarifaproyectousuario':item.tarifaproyectousuario,
                'costoproyectousuario':item.costoproyectousuario,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectousuarios[index].tarifaproyectousuario = (Number(item.tarifaproyectousuario)).toFixed(2);
                me.proyectousuarios[index].costoproyectousuario = Number(item.costoproyectousuario);
                me.proyectousuarios[index].notas          = item.notas;
                //me.proyectos[me.proyectos.findIndex(elemento => elemento.value === me.proyectousuarios[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
                me.snacktext = 'Updated';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = 'error'
                console.log(error);
            });
        },
        limpiar(){
                this.id="";
                this.rolid="";
                this.email="";
                this.nombre="";
                this.apellido="";
                this.iniciales=null;
                this.telefono="";
                this.password="";
                this.passwordAnt="";
                this.colfondo="#000000";
                this.coltexto="white";
                this.imgusario="";
                this.imageUrl="";
                this.lineaspag=0;
                this.pxch=false;
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.activo = false;          
                this.actPassword = false;
                this.groupdialog = false;
                this.editedIndex=-1;
        },
        guardar () {
            if (this.validar()){
                return;
            }
            var date = new Date();                
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                let me=this;
                if (me.password!=me.passwordAnt){
                    me.actPassword=true;
                }
                axios.put('api/Usuarios/Actualizar',{
                    'id':me.id,
                    'rolid':me.rolid,
                    'email':me.email,
                    'nombre':me.nombre,
                    'apellido':me.apellido,
                    'iniciales':me.iniciales,
                    'telefono': me.telefono,
                    'password':me.password,
                    'act_password':me.actPassword,
                    'colfondo':me.colfondo,
                    'coltexto':me.coltexto,
                    'imgusuario':me.imgusuario,
                    'lineaspag':me.lineaspag,
                    'pxch':me.pxch,
                    'iduseralta': me.iduseralta,
                    'fecalta': me.fecalta,
                    'iduserumod': me.$store.state.usuario.idusuario,
                    'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()                                            
                },configuracion).then( () => {
                    me.buscarUserinfo();
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                let me=this;
                axios.post('api/Usuarios/Crear',{
                    'rolid':me.rolid,
                    'email':me.email,
                    'nombre':me.nombre,
                    'apellido':me.apellido,
                    'iniciales':me.iniciales,
                    'telefono': me.telefono,
                    'password':me.password,
                    'colfondo':me.colfondo,
                    'coltexto':me.coltexto,
                    'imgusuario':me.imgusuario,
                    'lineaspag':me.lineaspag,
                    'pxch':me.pxch,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(){
                    //console.log(response);
                    me.buscarUserinfo();
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        buscarUserinfo(){
            let me=this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Traer/'+me.$store.state.usuario.idusuario,configuracion)
            .then(respuesta => {
                return respuesta.data
            })
            .then(data => {
                this.$store.dispatch("guardarUserinfo", data)
            })
            .catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        validar(){
            this.valida=0;
            this.validaMensaje=[];

            if (this.nombre.length<1 || this.nombre.length>100){
                this.validaMensaje.push("El nombre es obligatorio y debe tener menos de 100 caracteres.");
            }
            if (this.apellido.length<1 || this.apellido.length>100){
                this.validaMensaje.push("El apellido es obligatorio y debe tener menos de 100 caracteres.");
            }
            if (!this.rolid){
                this.validaMensaje.push("Seleccione un rol.");
            }
            if (!this.email){
                this.validaMensaje.push("Ingrese el email del usuario.");
            }
            if (!this.password){
                this.validaMensaje.push("Ingrese el password del usuario.");
            }
            if (this.iniciales.length<1 || this.iniciales.length>3){
                this.validaMensaje.push("Las iniciales deben tener al menos 1 caracter y no mas de 3 caracteres.");
            }
            if (!this.coltexto){
                this.validaMensaje.push("Seleccione un color de texto.");
            }
            if (!this.colfondo){
                this.validaMensaje.push("Seleccione un color de fondo.");
            }
            if (this.validaMensaje.length){
                this.valida=1;
            }
            return this.valida;
        },
        agregarGrupo(addgroup){
            let me=this;
            if(addgroup.length >= 3 && addgroup.length <= 50 ){
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Grupos/Crear',{
                    'nombre':addgroup,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    //console.log(response);
                    me.grupos.push({selected: false, nombre: response.data.nombre, value: response.data.id});
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.addgroup = "";
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            }
        },
        activarDesactivarMostrar(accion,item){
            this.adModal=1;
            this.adNombre=item.apellido+' '+item.nombre;
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
            axios.put('api/Usuarios/Activar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Usuarios/Desactivar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
    },
  }
</script>
