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
            :headers="headersskills"
            :items="skills"
            :search="searchs"
            class="elevation-1 blue-grey lighten-5"
            no-data-text="Nothing to Show"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>mdi-printer</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Skills</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field dense label="Search" outlined v-model="searchs" append-icon="mdi-magnify" single-line hide-details clearable ></v-text-field>
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
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="skill" 
                                                label="Skill name"
                                                counter="32"
                                                :rules="nameRules"
                                            />
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-switch 
                                                    dense 
                                                    v-model="ismainrole"
                                                    class="mx-2"
                                                    label="Main Role?"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="close">CANCEL</v-btn>
                                <v-btn color="success" dark :disabled="!validForm" text @click="guardar">SAVE</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="adModal" max-width="390">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">Active Skill?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Inactivate Skill?</v-card-title>
                                <v-card-text>
                                    You are about to 
                                    <span v-if="adAccion==1">Activate </span>
                                    <span v-if="adAccion==2">Inactivate </span>
                                    the Skill: {{ adNombre }}
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
                                <v-card-title class="headline">Item Info</v-card-title>
                                <v-card-text>
                                    <p><b>Creation:</b></p>
                                    {{iduseralta}}<br>
                                    {{fecalta}}
                                    <p/>
                                    <p><b>Last Update':</b></p>
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
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            v-bind="attrs"
                            v-on="on"
                            class="font-weight-bold"
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
                            class="font-weight-bold"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarArtistas(item)"
                            >
                            mdi-account-hard-hat
                            </v-icon>
                        </template>
                        <span>Personas</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="font-weight-bold"
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
                            class="font-weight-bold"
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
                                class="font-weight-bold"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(2,item)"
                                >
                                mdi-eye-off
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                class="font-weight-bold"
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
                            class="font-weight-bold"
                            v-bind="attrs"
                            v-on="on"
                            @click="infoItem(item)"
                            small
                            >
                            mdi-information-outline 
                            </v-icon>
                        </template>
                        <span>Info</span>
                    </v-tooltip>
                </template>
                <template v-slot:[`item.ismainrole`]="{ item }">
                    <td>
                        <div v-if="item.ismainrole">
                            <v-chip class="ma-2" color="primary" text-color="white">Yes</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2">No</v-chip>
                        </div>
                    </td>
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
            <v-dialog v-model="userdialog" max-width="750px">
                <v-data-table
                dense
                :headers="headersusuarios"
                :items="usuarios"
                :search="searchu"
                class="elevation-1"
                no-data-text="Nothing to show"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{userheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="12" sm="12">
                                        <v-text-field label="Search" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searchu" 
                                        append-icon="mdi-magnify" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="userdialog=false">Exit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionUsuario(item)"
                        ></v-simple-checkbox>
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
                                <v-btn color="primary" dense dark class="ma-2" @click.native="proydialog=false">Exit</v-btn>
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

                    <template v-slot:[`item.tarifaproyectogrupo`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.tarifaproyectogrupo"
                            large
                            cancel-text="Exit"
                            save-text="Save"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.tarifaproyectogrupo }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.tarifaproyectogrupo"
                                type="number"
                                label="Edit"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.costoproyectogrupo`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.costoproyectogrupo"
                            large
                            cancel-text="Exit"
                            save-text="Save"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.costoproyectogrupo }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.costoproyectogrupo"
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
        nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 32) || 'Name must be less than 32 characters',
        ],
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
        snackbar:false,
        snackcolor:'',
        snacktext: '',
        timeout: 2000,
        recordInfo:0,
        skills:[],
        usuarios:[],
        artistas:[],
        proyectos:[],
        proyectogrupos:[],
        workgroupId:'',
        imageUrl:'',
        userheader: '',
        proyheader: '',
        dialog: false,
        userdialog: false,
        proydialog: false,
        headersskills: [
            { text: 'Skill Name', value: 'skill', align: 'start', sortable: true },
            { text: 'Main Role?', value: 'ismainrole', align: 'start', sortable: true },
            { text: 'Status', value: 'activo', align: 'start', sortable: true  },
            { text: '[Options]', value: 'actions', align: 'center', sortable: false },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        headersusuarios: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Avatar', value: 'imgusuario', align: 'center', sortable: false },
            { text: 'Userid', value: 'userid', align: 'start', sortable: true },
            { text: 'email', value: 'email', align: 'start', sortable: true },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        headersproyectos: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Proyecto', value: 'skill', align: 'start', sortable: true },
            { text: 'Tarifa', value: 'tarifaproyectogrupo', align: 'end', sortable: true },
            { text: 'Costo', value: 'costoproyectogrupo', align: 'end', sortable: true },
            { text: 'Notas', value: 'notas', align: 'start', sortable: true },
        ],
        searchs:'',
        searchp:'',
        searchu:'',
        editedIndex: -1,
        id: '',
        skill:'',
        ismainrole: false,
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        colfondo:'#000000',
        coltexto:'black',
        imgusuario:'',
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New skill' : 'Update skill'
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
                    {title: "Skill name", dataKey: "skill"},
                    {title: "Mani Role", dataKey: "ismainrole"},
                    {title: "Active", dataKey: "activo"}
            ];
            var rows = [];

            this.skills.map(function(x){
                    rows.push({skill:x.skill, ismainrole: x.ismainrol?'SI':'NO', activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Skills", 40, 30);
                }
            });
            doc.save('Skills.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Skills/Listar',configuracion).then(function(response){
                //console.log(response);
                me.skills=response.data;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = 'error'
                console.log(error);
            });
        },
        select(){
            let me=this;
            var usuariosArray=[];
            var artistsArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                usuariosArray=response.data;
                usuariosArray.map(function(x){
                    me.usuarios.push({selected: false,iduseralta: x.iduseralta, iduserumod: x.iduserumod,
                    imgusuario: x.imgusuario, colfondo: x.colfondo, coltexto: x.coltexto, 
                    email: x.email, iniciales: x.iniciales, nombre: x.nombre, apellido: x.apellido, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Artists/Listar',configuracion).then(function(response){
                artistsArray=response.data;
                artistsArray.map(function(x){
                    me.artists.push({grupoid: x.grupoid, usuarioid: x.usuarioid, value:x.id});
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
            this.skill=item.skill;
            this.ismainrole=item.ismainrole;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;
            this.editedIndex=1;
            this.userdialog = false;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Skills/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            }
        },
        infoItem(item){
            var index = this.usuarios.findIndex(x => x.iduseralta === item.iduseralta);
            this.iduseralta=this.usuarios[index].email + ' (' + this.usuarios[index].nombre +' '+ this.usuarios[index].apellido + ')';
            this.fecalta=item.fecalta;
            this.iduserumod=this.usuarios[index].email + ' (' + this.usuarios[index].nombre +' '+ this.usuarios[index].apellido + ')';
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
        tratarArtistas(){
        },
        tratarProyectos(){
        },
        accionUsuario(){
        },
        accionProyecto(){
        },
        editProyecto(item){
            var me=this;
            let index=0;
            index = me.proyectogrupos.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectogrupos/Actualizar',{
                'Id':item.relid,
                'grupoid':this.workuserId,
                'proyectoid':item.value,
                'tarifaproyectogrupo':item.tarifaproyectogrupo,
                'costoproyectogrupo':item.costoproyectogrupo,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectogrupos[index].tarifaproyectogrupo = (Number(item.tarifaproyectogrupo)).toFixed(2);
                me.proyectogrupos[index].costoproyectogrupo = Number(item.costoproyectogrupo);
                me.proyectogrupos[index].notas          = item.notas;
                //me.proyectos[me.proyectos.findIndex(elemento => elemento.value === me.proyectogrupos[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
                this.skill="";
                this.ismainrole=false;
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.activo = false;
                this.validForm = false;
                this.userdialog = false;
                this.editedIndex=-1;
        },
        guardar () {
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                let me=this;
                axios.put('api/Skills/Actualizar',{
                    'Id': me.id,
                    'skill': me.skill,
                    'ismainrole': me.ismainrole,
                    'iduserumod': me.$store.state.usuario.idusuario
                },configuracion).then( () => {
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();                        
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            } else {
                //Código para guardar
                let me=this;
                axios.post('api/Skills/Crear',{
                    'skill': me.skill,
                    'ismainrole': me.ismainrol,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(){
                    //console.log(response);
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();                        
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
            this.adNombre=item.userid;
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
            axios.put('api/Skills/Activar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Skills/Desactivar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
    },
  }
</script>
