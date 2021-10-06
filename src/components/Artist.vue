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
            v-model="selected"
            dense
            :headers="headerartists"
            :items="artists"
            :search="searcha"
            show-select
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
                        <v-text-field dense label="Search" outlined v-model="searcha" clearable append-icon="mdi-magnify" single-line hide-details></v-text-field>
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
                                <v-form
                                    ref="form"
                                    v-model="validForm"
                                >
                                    <v-container
                                        class="grey lighten-5"
                                        grid-list-md>
                                        <v-row dense>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field 
                                                    dense 
                                                    v-model="fullname" 
                                                    label="Full Name" 
                                                    :rules="fullnameRules"
                                                    counter="64"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field 
                                                    dense
                                                    v-model="projectsworked"
                                                    label="Projects Worked"
                                                    counter="64"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field 
                                                    dense 
                                                    v-model="cost"
                                                    label="Cost"
                                                    counter="128"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    dense
                                                    v-model="phone"
                                                    label="Phone"
                                                    counter="32"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    dense
                                                    v-model="mobile"
                                                    label="Mobile"
                                                    counter="32"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    dense
                                                    v-model="email"
                                                    label="Email"
                                                    counter="64"
                                                />
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
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="close">CANCEL</v-btn>
                                <v-btn color="secondary" dark :disabled="!validForm" text @click="guardar">SAVE</v-btn>
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
                                    the Artist: {{ adNombre }}
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
                <template v-slot:[`item._mainroleartisttxs`]="{ item }">
                    <td>
                        <v-icon small @click="tratarMainrole" >mdi-plus</v-icon>
                    </td>
                    <td>
                        {{ item._mainroleartisttxs }}
                    </td>
                </template>
                <template v-slot:[`item._skillartisttxs`]="{ item }">
                    <td>
                        <v-icon small @click="tratarSkill">mdi-plus</v-icon>
                    </td>
                    <td>
                        {{ item._skillartisttxs }}
                    </td>
                </template>
                <template v-slot:[`item._notes`]="{ item }">
                    <td>
                        <v-icon small @click="tratarNote">mdi-plus</v-icon>
                    </td>
                    <td>
                        {{ item._notes }}
                    </td>
                </template>
                <template v-slot:[`item.imgartist`]="{ item }">
                    <td>
                        <div v-if="item.imgartist">
                            <v-avatar size=40>
                                <v-img :src="item.imgartist" aspect-ratio="2" contain></v-img>
                            </v-avatar>
                        </div>
                        <div v-else>
                            <v-avatar size=40>
                                <v-img :src="`https://ui-avatars.com/api/${item.fullname}`"  aspect-ratio="2" contain></v-img>
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
        validForm: false,
        fullnameRules: [
        v => !!v || 'Full Name is required',
        v => (v && v.length <= 64) || 'Name must be less than 64 characters',
        ],
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
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        selected: [],
        artists: [],
        schedules: [],
        skills: [],
        _skillartistids: [],
        _skillartisttxs: [],
        mainroleartists: [],
        _mainroleartistids: [],
        _mainroleartisttxs: [],
        notes: [],
        _notes: '',
        skillartists: [],
        ratings: [],
        portfolios: [],
        selections: [],
        selectedartists: [],
        usuarios: [],
        id: '',
        fullname: '',
        projectsworked: '',
        cost: '',
        costingdate: new Date(),
        costinguserid: '',
        email: '',
        phone: '',
        mobile: '',
        imgartist: '',
        proveeodrid: '',
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        imageUrl:'',
        dialog: false,
        editedIndex: -1,





        roles:[],
        grupos:[],
        proyectos:[],
        grupousuarios:[],
        proyectousuarios:[],
        workuserId:'',
        groupheader: '',
        proyheader: '',
        groupdialog: false,
        proydialog: false,
        searchg: '',
        searcha: '',
        searchp: '',
        rolid:'',
        iniciales:'',
        nombre:'',
        apellido:'',
        telefono: '',
        password:'',
        colfondo:'#000000',
        coltexto:'black',
        lineaspag: 0,
        pxch:false,
        addgroup: '',
        addproy: '',
        actPassword:false,
        passwordAnt:'',
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
        headerartists(){
            return [
                { text: 'Avatar', value: 'imgartist', align: 'center', sortable: false },
                { text: 'Full Name', value: 'fullname', align: 'start', sortable: true },
                //{ text: 'Main Role Ids', value: '_mainroleartistids', align: 'start', sortable: true },
                { text: 'Main Role Txt', value: '_mainroleartisttxs', align: 'start', sortable: true },
                //{ text: 'Skills Ids', value: '_skillartistids', align: 'start', sortable: true },
                { text: 'Skills Txt', value: '_skillartisttxs', align: 'start', sortable: true },
                { text: 'Project Worked', value: 'projectsworked', align: 'start', sortable: true },
                { text: 'Notes', value: '_notes', align: 'start', sortable: true },
                { text: 'Cost', value: 'cost', align: 'start', sortable: true },
                { text: 'eMail', value: 'email', align: 'start', sortable: true },
                { text: 'Phone', value: 'phone', align: 'start', sortable: true },
                { text: 'Mobile', value: 'mobile', align: 'start', sortable: true },
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
            return this.editedIndex === -1 ? 'New Artist' : 'Update Artist'
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    async mounted () {
        this.artists = []
        await this.select()
        await this.listar()
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
                    this.imgartist = this.imageUrl;
                })
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        clearImagen(){
            this.imageUrl = ''
            this.imgartist = ''
        },
        crearPDF(){
            var columns = [
                    {title: "Fullname", dataKey: "fullname"},
                    {title: "Projects Worked", dataKey: "projectsworked"},
                    {title: "Cost", dataKey: "cost"},
                    {title: "eMail", dataKey: "email"},
                    {title: "Phone", dataKey: "phone"},
                    {title: "Mobile", dataKey: "mobile"},
                    {title: "Active", dataKey: "activo"}
            ];
            var rows = [];

            this.artists.map(function(x){
                    rows.push({fullname:x.fullname,projectsworked:x.projectsworked,cost:x.cost,email:x.email,phone:x.phone,mobile:x.mobile,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Artist List", 40, 30);
                }
            });
            doc.save('Artist.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Artists/Listar',configuracion).then(function(response){
                //console.log(response);
                me.artists=response.data
                setTimeout(() => {
                    me.fillSnowflake(me.artists)
                    let trick = me.artists[0]
                    me.artists.splice( 0, 1, trick)
                }, 0)
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        fillSnowflake(items){
            let me = this
            var filtered = []
            var lor = ""
            var los = ""
            var sor = ""
            var sos = ""
            var index = ""
            var nots = ""
            for ( var i = 0; i < items.length ; i++) {
                //busca MainRole
                filtered = me.mainroleartists.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var mr = 0 ; mr < filtered.length; mr++ ){
                    lor += filtered[mr].skillid.toString()+', '
                    index = this.skills.findIndex(x => x.value === filtered[mr].skillid)
                    sor += me.skills[index].text+', '
                }
                // eslint-disable-next-line
                //debugger
                items[i]._mainroleartistids= lor.substring(0, lor.length - 2)
                items[i]._mainroleartisttxs= sor.substring(0, sor.length - 2)
                lor = ''
                sor = ''
                //busca Skills
                filtered = me.skillartists.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var ms = 0 ; ms < filtered.length; ms++ ){
                    los += filtered[ms].skillid.toString()+', '
                    index = this.skills.findIndex(x => x.value === filtered[ms].skillid)
                    sos += me.skills[index].text+', '
                }
                items[i]._skillartistids= los.substring(0, los.length - 2)
                items[i]._skillartisttxs= sos.substring(0, sos.length - 2)
                los = ''
                sos = ''
                //busca Notas
                filtered = me.notes.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var no = 0 ; no < filtered.length; no++ ){
                    nots += filtered[no].fecumod.substr(0,10)+': '+filtered[no].text+', '
                }
                items[i]._notes = nots.length>512?nots.substr(0,512):nots.substring(0, nots.length - 2)
                nots = ''
            }
        },
        select(){
            let me=this;
            let usuariosArray = []
            let skillsArray = []
            let mainroleartistsArray = []
            let skillartistsArray = []
            let notesArray = []
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                usuariosArray=response.data;
                usuariosArray.map(function(x){
                    me.usuarios.push({iduseralta: x.iduseralta, iduserumod: x.iduserumod,
                    imgusuario: x.imgusuario, colfondo: x.colfondo, coltexto: x.coltexto, 
                    email: x.email, iniciales: x.iniciales, nombre: x.nombre, apellido: x.apellido, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Skills/Select',configuracion).then(function(response){
                skillsArray=response.data;
                skillsArray.map(function(x){
                    me.skills.push({selected: false, value:x.id, text: x.skill, ismainrole: x.ismainrole });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Skillartists/Listar',configuracion).then(function(response){
                skillartistsArray=response.data;
                skillartistsArray.map(function(x){
                    me.skillartists.push({selected: false, value: x.id, skillid: x.skillid, artistid: x.artistid, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Mainroleartists/Listar',configuracion).then(function(response){
                mainroleartistsArray=response.data;
                mainroleartistsArray.map(function(x){
                    me.mainroleartists.push({selected: false, value:x.id, skillid: x.skillid, artistid: x.artistid, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Notes/Listar',configuracion).then(function(response){
                notesArray=response.data;
                notesArray.map(function(x){
                    me.notes.push({selected: false, value:x.id, artistid: x.artistid, text: x.note, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        lovskillstxs (lov) {
            let me = this;
            var aux = ''
            if ( me.skills.length > 0) {
                var index = 0
                if (lov.length > 0){
                    for (var i = 0; i < lov.length-1; i++){
                        index = this.skills.findIndex(x => x.value == lov[i])
                        aux += this.skills[index].text+', '
                    }
                    index = this.skills.findIndex(x => x.value == lov[lov.length-1])
                    aux += this.skills[index].text
                }
            }
            return aux
        },
        editItem (item) {
            this.id=item.id;
            this.fullname=item.fullname;
            // this._skillartistids=item._skillartistids;
            // this._skillartisttxs=item._skillartisttxs;
            // this._mainroleartistids=item._mainroleartistids;
            // this._mainroleartisttxs=item._mainroleartisttxs;
            this.projectsworked=item.projectsworked;
            this.cost=item.cost;
            this.costingdate=item.costingdate;
            this.costinguserid=item.costinguserid;
            this.email=item.email;
            this.phone=item.phone;
            this.mobile=item.mobile;
            this.imgartist=item.imgartist;
            this.imageUrl=item.imgartist;
            this.proveedorid=item.proveedorid;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;


            this.colfondo=item.colfondo;
            this.coltexto=item.coltexto;
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
                axios.delete('api/Artists/Eliminar/'+item.id,configuracion).then( () => {
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
                this.id = ""
                this.fullname = ""
                this.projectworked = ""
                this.cost = ""
                this.costingdate = new Date();
                this.email = ""
                this.phone = ""
                this.mobile = ""
                this.imgusario = ""
                this.imageUrl = ""
                this.proveedorid = ""
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.activo = false;          

                this.groupdialog = false;
                this.editedIndex=-1;
        },
        guardar () {
            let me = this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Artists/Actualizar',{
                    'id': me.id,
                    'fullname': me.fullname,
                    'projectsworked': me.projectsworked,
                    'cost': me.cost,
                    'costingdate': me.costingdate,
                    'costinguserid': me.costinguserid,
                    'email':me.email,
                    'phone': me.phone,
                    'mobile':me.mobile,
                    'imgartist':me.imgartist,
                    'proveedorid':me.proveedorid,
                    'iduserumod': me.$store.state.usuario.idusuario,
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
                axios.post('api/Artists/Crear',{
                    'fullname': me.fullname,
                    'projectsworked': me.projectsworked,
                    'cost': me.cost,
                    'costingdate': me.costingdate,
                    'costinguserid': me.costinguserid,
                    'email':me.email,
                    'phone': me.phone,
                    'mobile':me.mobile,
                    'imgartist':me.imgartist,
                    'proveedorid':me.proveedorid,
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
            axios.get('api/Artists/Traer/'+me.$store.state.usuario.idusuario,configuracion)
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
        tratarMainrole(item){
            let me = this
            console.log(me, item)
        },
        tratarSkill(item){
            let me = this
            console.log(me, item)
        },
        tratarNote(item){
            let me = this
            console.log(me, item)
        },
        tratarGrupos(item){
            let me=this;
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
            axios.put('api/Artists/Activar/'+this.adId,{},configuracion).then( () => {
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

            axios.put('api/Artists/Desactivar/'+this.adId,{},configuracion).then( () => {
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
