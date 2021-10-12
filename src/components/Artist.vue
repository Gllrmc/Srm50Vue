<template>
    <v-row align="start" style="overflow: auto">
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
            :headers="headerartists"
            :items="artists"
            :items-per-page="10"
            :search="searcha"
            item-key="fullname"
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
                                <v-btn color="primary" text @click="closedialog">CANCEL</v-btn>
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
                        <v-dialog v-model="recordInfo" max-width="500">
                            <v-card>
                                <v-card-title class="headline">Item info: {{ adNombre}}</v-card-title>
                                <v-card-text>
                                    <p>{{fullname}}</p>
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
                                    <v-btn small @click="recordInfo=false">Close
                                    <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="roledialog" max-width=500>
                            <v-data-table
                                :headers="headermainroles"
                                :items="roles"
                                :search="searchr"
                                class="elevation-1"
                                :items-per-page="5"
                                no-data-text="Nothing to Show"
                            >
                                <template v-slot:top>
                                    <v-card flat color="white">
                                        <v-card-title>{{roleheader}}</v-card-title>
                                        <v-card-actions>
                                                <v-text-field label="Search" class="ma-2" 
                                                outlined 
                                                dense 
                                                v-model="searchr" 
                                                append-icon="mdi-magnify" 
                                                single-line 
                                                hide-details
                                                clearable 
                                                ></v-text-field>
                                            <v-btn color="primary" dense dark class="ma-2" @click.native="roledialog=false">Close</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                                <template v-slot:[`item.selected`]="{ item }">
                                    <v-simple-checkbox
                                        v-model="item.selected"
                                        :ripple="false"
                                        @click="accionRole(item)"
                                    ></v-simple-checkbox>
                                </template>
                            </v-data-table>
                        </v-dialog>
                        <v-dialog v-model="skilldialog" max-width=500>
                            <v-data-table
                                :headers="headerskills"
                                :items="skills"
                                :search="searchs"
                                class="elevation-1"
                                :items-per-page="5"
                                no-data-text="Nothing to Show"
                            >
                                <template v-slot:top>
                                    <v-card flat color="white">
                                        <v-card-title>{{skillheader}}</v-card-title>
                                        <v-card-actions>
                                                <v-text-field label="Search" class="ma-2" 
                                                outlined 
                                                dense 
                                                v-model="searchs" 
                                                append-icon="mdi-magnify" 
                                                single-line 
                                                hide-details
                                                clearable 
                                                >
                                            </v-text-field>
                                            <v-btn color="primary" dense dark class="ma-2" @click.native="skilldialog=false">Close</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                                <template v-slot:[`item.selected`]="{ item }">
                                    <v-simple-checkbox
                                        v-model="item.selected"
                                        :ripple="false"
                                        @click="accionSkill(item)"
                                    ></v-simple-checkbox>
                                </template>
                            </v-data-table>
                        </v-dialog>
                        <v-dialog v-model="portfoliodialog" max-width=700>
                            <v-data-table
                                :headers="headerportfolio"
                                :items="portfolioartists"
                                sort-by="text"
                                class="elevation-1"
                                :items-per-page="5"
                            >
                                <template v-slot:top>
                                <v-toolbar
                                    flat
                                >
                                    <v-toolbar-title>Portfolio of {{portfolioheader}}</v-toolbar-title>
                                    <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                    ></v-divider>
                                    <v-spacer/>   
                                    <v-dialog
                                        v-model="portfolioCRUDdialog"
                                        max-width="600px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >
                                            NEW
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <p class="text-h5">{{ formTitlePortfolio }} for {{ portfolioheader }}</p>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form
                                                ref="portfolioform"
                                                v-model="validportfolioform"
                                                >
                                                    <v-container>
                                                        <v-col
                                                            cols="12"
                                                            sm="12"
                                                            md="12"
                                                        >
                                                            <v-text-field
                                                            v-model="url"
                                                            label="URL Instance"
                                                            :rules="urlRules"
                                                            counter="128"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-container>
                                                </v-form>
                                            </v-card-text>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                text
                                                @click="closePortfolio"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                color="primary"
                                                text
                                                :disabled ="!validportfolioform"
                                                @click="savePortfolio"
                                            >
                                                Save
                                            </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-dialog v-model="dialogDeletePortfolio" max-width="520px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this item?
                                        </v-card-title>
                                        <p class="ml-3" >{{url}}</p>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="closeDeletePortfolio">Cancel</v-btn>
                                        <v-btn color="primary" text @click="deletePorfolioConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                                </v-toolbar>
                                </template>
                                <template v-slot:[`item.text`]="{ item }">
                                    <v-chip
                                        class="ma-2"
                                        color="scondary"
                                        label
                                        @click="openTab(item.text)"
                                    >
                                        {{ item.text}}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editPortfolio(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deletePortfolio(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                            </v-data-table>
                        </v-dialog>
                        <v-dialog v-model="notedialog" max-width=700>
                            <v-data-table
                                :headers="headernotes"
                                :items="noteartists"
                                sort-by="fecumod"
                                sort-desc
                                :search="searchn"
                                class="elevation-1"
                                :items-per-page="5"
                            >
                                <template v-slot:top>
                                <v-toolbar
                                    flat
                                >
                                    <v-toolbar-title>Notes of {{ noteheader }}</v-toolbar-title>
                                    <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                    ></v-divider>
                                    <v-spacer/>   
                                    <v-dialog
                                        v-model="noteCRUDdialog"
                                        max-width="600px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >
                                            NEW
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <p class="text-h5">{{ formTitleNote }} for {{ noteheader }}</p>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form
                                                ref="noteform"
                                                v-model="validnoteform"
                                                >
                                                    <v-container>
                                                        <v-col
                                                            cols="12"
                                                            sm="12"
                                                            md="12"
                                                        >
                                                            <v-text-field
                                                            v-model="note"
                                                            label="Note"
                                                            :rules="noteRules"
                                                            counter="512"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-container>
                                                </v-form>
                                            </v-card-text>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                text
                                                @click="closeNote"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                color="primary"
                                                text
                                                :disabled ="!validnoteform"
                                                @click="saveNote"
                                            >
                                                Save
                                            </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-dialog v-model="dialogDeleteNote" max-width="520px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this note?
                                        </v-card-title>
                                        <p class="ml-3" >{{note}}</p>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="closeDeleteNote">Cancel</v-btn>
                                        <v-btn color="primary" text @click="deleteNoteConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                                </v-toolbar>
                                </template>
                                <template v-slot:[`item.fecumod`]="{ item }">
                                    {{ item.fecumod.substr(0,10) }}
                                </template>
                                <template v-slot:[`item.text`]="{ item }">
                                    {{ item.text}}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editNote(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteNote(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                            </v-data-table>
                        </v-dialog>
                        <v-dialog v-model="scheduledialog" max-width=700>
                            <v-data-table
                                :headers="headerschedules"
                                :items="scheduleartists"
                                sort-by="fecumod"
                                sort-desc
                                :search="searchn"
                                class="elevation-1"
                                :items-per-page="5"
                            >
                                <template v-slot:top>
                                <v-toolbar
                                    flat
                                >
                                    <v-toolbar-title>Schedule of {{ scheduleheader }}</v-toolbar-title>
                                    <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                    ></v-divider>
                                    <v-spacer/>   
                                    <v-dialog
                                        v-model="scheduleCRUDdialog"
                                        max-width="600px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >
                                            NEW
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <p class="text-h5">{{ formTitleSchedule }} for {{ scheduleheader }}</p>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form
                                                ref="scheduleform"
                                                v-model="validscheduleform"
                                                >
                                                    <v-container>
                                                        <v-row>
                                                            <v-col
                                                                cols="12"
                                                                sm="6"
                                                                md="6"
                                                            >
                                                                <v-menu
                                                                ref="menu"
                                                                v-model="menu"
                                                                :close-on-content-click="false"
                                                                :return-value.sync="dates"
                                                                transition="scale-transition"
                                                                offset-y
                                                                min-width="auto"
                                                                >
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-text-field
                                                                    v-model="dateRangeText"
                                                                    label="Date range"
                                                                    prepend-icon="mdi-calendar"
                                                                    readonly
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-date-picker
                                                                    v-model="dates"
                                                                    color="primary"
                                                                    range
                                                                    no-title
                                                                    scrollable
                                                                >
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="menu = false"
                                                                    >
                                                                    Cancel
                                                                    </v-btn>
                                                                    <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="$refs.menu.save(dates)"
                                                                    >
                                                                    OK
                                                                    </v-btn>
                                                                </v-date-picker>
                                                                </v-menu>
                                                            </v-col>
                                                            <v-col
                                                                cols="12"
                                                                sm="6"
                                                                md="6"
                                                            >
                                                                <v-text-field
                                                                v-model="reason"
                                                                label="Reason"
                                                                counter="32"
                                                                ></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-form>
                                            </v-card-text>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                text
                                                @click="closeSchedule"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                color="primary"
                                                text
                                                :disabled ="!validscheduleform"
                                                @click="saveSchedule"
                                            >
                                                Save
                                            </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-dialog v-model="dialogDeleteSchedule" max-width="570px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this schedule?
                                        </v-card-title>
                                        <p class="ml-3" >{{ dateRangeText }} {{reason}}</p>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="closeDeleteSchedule">Cancel</v-btn>
                                        <v-btn color="primary" text @click="deleteScheduleConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                                </v-toolbar>
                                </template>
                                <template v-slot:[`item.startdate`]="{ item }">
                                    {{ item.startdate.substr(0,10) }}
                                </template>
                                <template v-slot:[`item.enddate`]="{ item }">
                                    {{ item.enddate.substr(0,10) }}
                                </template>
                                <template v-slot:[`item.reason`]="{ item }">
                                    {{ item.reason}}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editSchedule(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteSchedule(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                            </v-data-table>
                        </v-dialog>

                        <v-dialog v-model="ratingdialog" max-width=700>
                            <v-data-table
                                :headers="headerratings"
                                :items="ratingartists"
                                sort-by="fecumod"
                                sort-desc
                                :search="searchn"
                                class="elevation-1"
                                :items-per-page="5"
                            >
                                <template v-slot:top>
                                <v-toolbar
                                    flat
                                >
                                    <v-toolbar-title>Ratings of {{ ratingheader }}</v-toolbar-title>
                                    <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                    ></v-divider>
                                    <v-spacer/>   
                                    <v-dialog
                                        v-model="ratingCRUDdialog"
                                        max-width="600px"
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >
                                            NEW
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <p class="text-h5">{{ formTitleRating }} for {{ ratingheader }}</p>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form
                                                ref="ratingform"
                                                v-model="validratingform"
                                                >
                                                    <v-container>
                                                        <v-row>
                                                            <v-col
                                                                cols="12"
                                                                sm="8"
                                                                md="8"
                                                            >
                                                                <v-text-field
                                                                v-model="projectname"
                                                                label="Project name"
                                                                type="text"
                                                                :rules="noempty32"
                                                                counter="32"
                                                                ></v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="12"
                                                                sm="4"
                                                                md="4"
                                                            >
                                                                <v-text-field
                                                                v-model="Sscore"
                                                                type="number"
                                                                label="Score"
                                                                :rules="scoreRules"
                                                                min="0"
                                                                max="5"
                                                                ></v-text-field>
                                                                <!-- <v-rating
                                                                v-model="score"
                                                                color="yellow darken-4"
                                                                background-color="grey darken-1"
                                                                empty-icon="$ratingFull"
                                                                x-small
                                                                hover
                                                                ></v-rating> -->
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-form>
                                            </v-card-text>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                text
                                                @click="closeRating"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                color="primary"
                                                text
                                                :disabled ="!validratingform"
                                                @click="saveRating"
                                            >
                                                Save
                                            </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-dialog v-model="dialogDeleteRating" max-width="550px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this rating?
                                        </v-card-title>
                                        <p class="ml-3" >{{rating}}</p>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="closeDeleteRating">Cancel</v-btn>
                                        <v-btn color="primary" text @click="deleteRatingConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                                </v-toolbar>
                                </template>
                                <template v-slot:[`item.fecumod`]="{ item }">
                                    {{ item.fecumod.substr(0,10) }}
                                </template>
                                <template v-slot:[`item.text`]="{ item }">
                                    {{ item.text}}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editRating(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteRating(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                            </v-data-table>
                        </v-dialog>

                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip 
                        bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            :disabled="!item.activo"
                            dense
                            class="mr-1"
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
                            dense
                            class="mr-1"
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
                                dense
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(2,item)"
                                >
                                mdi-eye-off
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                dense
                                class="mr-1"
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
                            dense
                            class="mr-1"
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
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarRoles(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Main Role</span>
                        </v-tooltip>
                    </td>
                    <td>
                        {{ item._mainroleartisttxs }}
                    </td>
                </template>
                <template v-slot:[`item._skillartisttxs`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarSkill(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Skills</span>
                        </v-tooltip>
                    </td>
                    <td>
                        {{ item._skillartisttxs }}
                    </td>
                </template>
                <template v-slot:[`item._notes`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarNote(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Notes</span>
                        </v-tooltip>
                    </td>
                    <td>
                        {{ item._notes }}
                    </td>
                </template>
                <template v-slot:[`item._portfolios`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarPortfolio(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Portfolio</span>
                        </v-tooltip>
                    </td>
                    <td>
                        {{ item._portfolios }}
                    </td>
                </template>
                <template v-slot:[`item._schedules`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarSchedule(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Schedules</span>
                        </v-tooltip>
                    </td>
                    <td>
                        {{ item._schedules }}
                    </td>
                </template>
                <template v-slot:[`item._rating`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarRating(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Ratings</span>
                        </v-tooltip>
                    </td>
                    <td>
                        <v-rating
                            v-model="item._rating"
                            color="yellow darken-4"
                            background-color="grey darken-1"
                            readonly
                            x-small
                            dense
                        ></v-rating>
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
    </v-row>
</template>
<script>
  import axios from 'axios'
  import jsPDF from 'jspdf'
  export default {
      data: () => ({
        validForm: false,
        validportfolioform: false,
        validnoteform: false,
        validscheduleform: false,
        validratingform: false,
        menu: false,
        fullnameRules: [
            v => !!v || 'Full Name is required',
        v => (v && v.length <= 64) || 'Name must be less than 64 characters',
        ],
        urlRules: [
            v => !!v || 'URL is required',
            v => (v && v.length <= 128) || 'URL must be less than 128 characters',
            v => !(/[ ]/.test(v)) || 'no spaces allowed',
        ],
        noteRules: [
            v => !!v || 'Note is required',
            v => (v && v.length <= 128) || 'Note must be less than 512 characters',
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
        dependentWindow: '',
        searcha: '',
        searchr: '',
        searchs: '',
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        selected: [],
        artists: [],
        schedules: [],
        _shcedules: '',
        scheduleartists: [],
        skills: [],
        _skillartistids: [],
        _skillartisttxs: [],
        skillartists: [],
        roles: [],
        _mainroleartistids: [],
        _mainroleartisttxs: [],
        mainroleartists: [],
        portfolios: [],
        _portfolios: '',
        portfolioartists: [],
        notes: [],
        _notes: '',
        noteartists: [],
        ratings: [],
        _rating: [],
        ratingartists: [],
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
        editedIndex: -1,
        dialog: false,
        workedartistid: '',
        roledialog: false,
        roleheader: '',
        skilldialog: false,
        skillheader: '',
        portfoliodialog: false,
        portfolioCRUDdialog: false,
        dialogDeletePortfolio: false,
        portfolioheader: '',
        url: '',
        notedialog: false,
        noteCRUDdialog: false,
        dialogDeleteNote: false,
        noteheader: '',
        note: '',
        scheduledialog: false,
        scheduleCRUDdialog: false,
        dialogDeleteSchedule: false,
        scheduleheader: '',
        startdate: '',
        enddate: '',
        dates: [],
        reason: '',
        projectname: '',
        score: 0,
        ratingdialog: false,
        ratingCRUDdialog: false,
        dialogDeleteRating: false,
        ratingheader: '',
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: '',





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
        searchn: '',
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
    }),

    computed: {
        dateRangeText () {
            return this.dates.join(' ~ ')
        },
        headerartists(){
            return [
                { text: 'Avatar', value: 'imgartist', align: 'center', sortable: false },
                { text: 'Full Name', value: 'fullname', align: 'start', sortable: true, width: 250 },
                //{ text: 'Main Role Ids', value: '_mainroleartistids', align: 'start', sortable: true },
                { text: 'Main Role Txt', value: '_mainroleartisttxs', align: 'start', sortable: true },
                //{ text: 'Skills Ids', value: '_skillartistids', align: 'start', sortable: true },
                { text: 'Skills Txt', value: '_skillartisttxs', align: 'start', sortable: true, width: 250 },
                { text: 'Portfolio', value: '_portfolios', align: 'start', sortable: true },
                { text: 'Project Worked', value: 'projectsworked', align: 'start', sortable: true },
                { text: 'Notes', value: '_notes', align: 'start', sortable: true, width: 250 },
                { text: 'Schedules', value: '_schedules', align: 'start', sortable: true, width: 300 },
                { text: 'Rating', value: '_rating', align: 'center', sortable: true },
                { text: 'Cost', value: 'cost', align: 'start', sortable: true, width: 150 },
                { text: 'eMail', value: 'email', align: 'start', sortable: true },
                { text: 'Phone', value: 'phone', align: 'start', sortable: true },
                { text: 'Mobile', value: 'mobile', align: 'start', sortable: true },
                { text: 'Status', value: 'activo', align: 'start', sortable: true  },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 200 },
            ]
        },
        headermainroles(){
            return [
                { text: '#', value: 'selected', align: 'center', sortable: true },
                { text: 'Main Role', value: 'text', align: 'start', sortable: true },
            ]
        },
        headerskills(){
            return [
                { text: '#', value: 'selected', align: 'center', sortable: true },
                { text: 'Skill', value: 'text', align: 'start', sortable: true },
            ]
        },
        headerportfolio(){
            return [
                { text: 'Instance', value: 'text', align: 'start', sortable: true },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 100 },
            ]
        },
        headernotes(){
            return [
                { text: 'Updated', value: 'fecumod', align: 'start', sortable: true },
                { text: 'Note', value: 'text', align: 'start', sortable: true },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 100 },
            ]
        },
        headerschedules(){
            return [
                { text: 'Start', value: 'startdate', align: 'start', sortable: true },
                { text: 'End', value: 'enddate', align: 'start', sortable: true },
                { text: 'Reason', value: 'reason', align: 'start', sortable: true },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 100 },
            ]
        },
        headerratings(){
            return [
                { text: 'Updated', value: 'fecumod', align: 'start', sortable: true },
                { text: 'Project', value: 'projectname', align: 'start', sortable: true },
                { text: 'Score', value: 'score', align: 'center', sortable: true },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 100 },
            ]
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Artist' : 'Update Artist'
        },
        formTitlePortfolio () {
            return this.editedIndex === -1 ? 'New Portfolio' : 'Update Portfolio'
        },
        formTitleNote () {
            return this.editedIndex === -1 ? 'New Note' : 'Update Note'
        },
        formTitleSchedule () {
            return this.editedIndex === -1 ? 'New Schedule' : 'Update Schedule'
        },
        formTitleRating () {
            return this.editedIndex === -1 ? 'New Rate' : 'Update Rate'
        },
    },

    watch: {
        dialog (val) {
            val || this.closedialog()
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
        open () {
        },
        close () {
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
            let me = this
            let header={"Authorization" : "Bearer " + me.$store.state.token};
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
            var pors = ""
            var sum = 0
            var qty = 0
            var sche = ""
            // eslint-disable-next-line
            //debugger
            for ( var i = 0; i < items.length ; i++) {
                //busca Skills
                filtered = me.skillartists.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var ms = 0 ; ms < filtered.length; ms++ ){
                    los += filtered[ms].skillid.toString()+', '
                    index = me.skills.findIndex(x => x.value === filtered[ms].skillid)
                    sos += me.skills[index].text+', '
                }
                items[i]._skillartistids= los.substring(0, los.length - 2)
                items[i]._skillartisttxs= sos.substring(0, sos.length - 2)
                los = ''
                sos = ''
                //busca MainRole
                filtered = me.mainroleartists.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var mr = 0 ; mr < filtered.length; mr++ ){
                    lor += filtered[mr].skillid.toString()+', '
                    index = me.skills.findIndex(x => x.value === filtered[mr].skillid)
                    sor += me.skills[index].text+', '
                }
                me.roles = me.skills.filter( x => x.ismainrole)
                items[i]._mainroleartistids= lor.substring(0, lor.length - 2)
                items[i]._mainroleartisttxs= sor.substring(0, sor.length - 2)
                lor = ''
                sor = ''
                //busca Notas
                filtered = me.notes.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var no = 0 ; no < filtered.length; no++ ){
                    nots += filtered[no].fecumod.substr(0,10)+': '+filtered[no].text+', '
                }
                items[i]._notes = nots.length>512?nots.substr(0,512):nots.substring(0, nots.length - 2)
                nots = ''
                //busca Portfolios
                filtered = me.portfolios.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var po = 0 ; po < filtered.length; po++ ){
                    pors += filtered[po].text+' '
                }
                items[i]._portfolios = pors.length>128?pors.substr(0,128):pors.substring(0, pors.length - 1)
                pors = ''
                //Calcula Rating
                filtered = me.ratings.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var ra = 0 ; ra < filtered.length; ra++ ){
                    if (filtered[ra].activo){
                        sum += filtered[ra].score
                        qty++
                    }
                }
                items[i]._rating = Math.round(sum / qty)
                sum = 0
                qty = 0
                // Arma Schedule
                filtered = me.schedules.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var sc = 0 ; sc < filtered.length; sc++ ){
                    sche += "[" + filtered[sc].startdate.substr(0,10) + ' ~ ' + filtered[sc].enddate.substr(0,10) + "] " + filtered[sc].reason + ", "
                }
                items[i]._schedules = sche.length>128?sche.substr(0,128):sche.substring(0, sche.length - 2)
                sche = ''
            }
        },
        select(){
            let me = this;
            let usuariosArray = []
            let skillsArray = []
            let mainroleartistsArray = []
            let skillartistsArray = []
            let notesArray = []
            let portfoliosArray = []
            let ratingsArray = []
            let schedulesArray = []
            let header={"Authorization" : "Bearer " + me.$store.state.token};
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
                    me.skills.push({selected: false, value:x.id, text: x.skill, ismainrole: x.ismainrole, relid: 0 });
                    me.roles=me.skills.filter(e => e.ismainrole)
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
            axios.get('api/Portfolios/Listar',configuracion).then(function(response){
                portfoliosArray=response.data;
                portfoliosArray.map(function(x){
                    me.portfolios.push({selected: false, value:x.id, artistid: x.artistid, text: x.url, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Ratings/Listar',configuracion).then(function(response){
                ratingsArray=response.data;
                ratingsArray.map(function(x){
                    me.ratings.push({selected: false, value:x.id, artistid: x.artistid, projectname: x.projectname, score: x.score, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Schedules/Listar',configuracion).then(function(response){
                schedulesArray=response.data;
                schedulesArray.map(function(x){
                    me.schedules.push({value:x.id, artistid: x.artistid, startdate: x.startdate, enddate: x.enddate,
                        reason: x.reason, iduseralta: x.iduseralta, fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
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
            this.fullname=item.fullname;
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
            var me = this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Artists/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.closedialog();
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
            this.adNombre = item.fullname;
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
            this.adNombre='';
            this.recordInfo = false;
        },
        closedialog () {
            this.dialog = false
            this.limpiar();
        },
        editProyecto(item){
            var me = this
            let index=0;
            index = me.proyectousuarios.findIndex(element => element.value === item.relid );
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectousuarios/Actualizar',{
                'id':item.relid,
                'usuarioid':me.workuserId,
                'proyectoid':item.value,
                'tarifaproyectousuario':item.tarifaproyectousuario,
                'costoproyectousuario':item.costoproyectousuario,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectousuarios[index].tarifaproyectousuario = (Number(item.tarifaproyectousuario)).toFixed(2);
                me.proyectousuarios[index].costoproyectousuario = Number(item.costoproyectousuario);
                me.proyectousuarios[index].notas = item.notas;
                //me.proyectos[me.proyectos.findIndex(element => element.value === me.proyectousuarios[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.closedialog();
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
                    me.snacktext = 'Created';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.closedialog();
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
        tratarRoles(element){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.roles.length; l++){
                me.roles[l].selected = false;
                me.roles[l].relid = 0;
            }
            // eslint-disable-next-line
            //debugger
            for (var i = 0; i < me.mainroleartists.length; i++){
                if (me.mainroleartists[i].artistid === element.id){
                    index = me.roles.findIndex(element => element.value === me.mainroleartists[i].skillid );
                    me.roles[index].selected = true;
                    me.roles[index].relid = me.mainroleartists[i].value;
                }
            }
            me.workedartistid = element.id;
            me.roleheader = 'Main Role assigned to ' + element.fullname;
            me.roledialog=!me.roledialog;
        },
        tratarSkill(element){
            var me = this;
            let index = 0;
            for (var l = 0; l < me.skills.length; l++){
                me.skills[l].selected = false;
                me.skills[l].relid = 0;
            }
            // eslint-disable-next-line
            //debugger
            for (var i = 0; i < me.skillartists.length; i++){
                if (me.skillartists[i].artistid === element.id){
                    index = me.skills.findIndex(element => element.value === me.skillartists[i].skillid );
                    me.skills[index].selected = true;
                    me.skills[index].relid = me.skillartists[i].value;
                }
            }
            me.workedartistid = element.id;
            me.skillheader = 'Skill assigned to ' + element.fullname;
            me.skilldialog=!me.skilldialog;
        },
        tratarPortfolio(element){
            var me = this;
            me.portfolioartists = me.portfolios.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.portfolioheader = element.fullname;
            me.portfoliodialog=!me.portfoliodialog;
        },
        tratarNote(element){
            var me = this;
            me.noteartists = me.notes.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.noteheader = element.fullname;
            me.notedialog=!me.notedialog;
        },
        tratarRating(element){
            var me = this;
            me.ratingartists = me.ratings.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.ratingheader = element.fullname;
            me.ratingdialog=!me.ratingdialog;
        },
        tratarSchedule(element){
            var me = this;
            me.scheduleartists = me.schedules.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.scheduleheader = element.fullname;
            me.scheduledialog=!me.scheduledialog;
        },
        tratarGrupos(item){
            let me=this;
            let index = 0;
            for (var l = 0; l < me.grupos.length; l++){
                me.grupos[l].selected = false;
            }
            for (let i = 0; i < me.grupousuarios.length; i++){
                if (me.grupousuarios[i].usuarioid === item.id){
                    index = me.grupos.findIndex(element => element.value === me.grupousuarios[i].grupoid );
                    me.grupos[index].selected = true;
                }
            }
            me.workuserId = item.id;
            me.groupheader = 'Grupos de ' + item.iniciales + ' ' + item.email;
            me.groupdialog=!me.groupdialog;
        },
        accionRole (item) {
            var me = this;
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Mainroleartists/Crear',{
                    'skillid': item.value,
                    'artistid': me.workedartistid,
                    'iduseralta': me.$store.state.usuario.idusuario
                },configuracion)
                .then(function(response){
                    me.mainroleartists.push({selected: true, skillid: response.data.skillid, artistid: response.data.artistid, value: response.data.id});
                    me.fillSnowflake(me.artists)
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
                var indice = me.mainroleartists.find(x => item.value === x.skillid && me.workedartistid === x.artistid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Mainroleartists/Eliminar/'+indice,configuracion).then( () => {
                    me.mainroleartists = me.mainroleartists.filter(x => x.value != indice);
                    me.fillSnowflake(me.artists)
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
        accionSkill (item) {
            var me = this;
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Skillartists/Crear',{
                    'skillid': item.value,
                    'artistid': me.workedartistid,
                    'iduseralta': me.$store.state.usuario.idusuario
                },configuracion)
                .then(function(response){
                    me.skillartists.push({selected: true, skillid: response.data.skillid, artistid: response.data.artistid, value: response.data.id});
                    me.fillSnowflake(me.artists)
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
                var indice = me.skillartists.find(x => item.value === x.skillid && me.workedartistid === x.artistid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Skillartists/Eliminar/'+indice,configuracion).then( () => {
                    me.skillartists = me.skillartists.filter(x => x.value != indice);
                    me.fillSnowflake(me.artists)
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
        editPortfolio(element){
            this.editedIndex = this.portfolios.indexOf(element)
            this.url = element.text
            this.portfolioCRUDdialog = true
        },
        closePortfolio(){
            this.editedIndex = -1
            this.url = ''
            this.portfolioCRUDdialog = false
        },
        deletePortfolio(element){
            this.editedIndex = this.portfolios.indexOf(element)
            this.url = element.text
            this.dialogDeletePortfolio = true
        },
        closeDeletePortfolio(){
            this.dialogDeletePortfolio = false
            this.url = ''
            this.editedIndex = -1
        },
        deletePorfolioConfirm(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.delete('api/Portfolios/Eliminar/'+me.portfolios[me.editedIndex].value,configuracion).then( () => {
                me.portfolios = me.portfolios.filter(x => x.value != me.portfolios[me.editedIndex].value);
                me.portfolioartists = me.portfolios.filter(e => e.artistid === me.workedartistid)
                me.fillSnowflake(me.artists);
                me.closeDeletePortfolio;
                me.snacktext = 'Eliminated';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        savePortfolio(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            //console.log(me.editedIndex, me.url)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Portfolios/Actualizar',{
                    'id': me.portfolios[me.editedIndex].value,
                    'url': me.url,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.portfolios[me.editedIndex].text = response.data.url
                    me.portfolios[me.editedIndex].iduserumod = response.data.iduserumod
                    me.portfolios[me.editedIndex].fecumod = response.data.fecumod
                    me.portfolioartists = me.portfolios.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closePortfolio();
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                axios.post('api/Portfolios/Crear',{
                    'artistid': me.workedartistid,
                    'url': me.url,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.portfolios.push({selected: false, value: response.data.id, artistid: response.data.artistid, text: response.data.url,
                        iduseralta: response.data.iduseralta, fecalta: response.data.fecalta, iduserumod: response.data.iduserumod, fecumod: response.data.fecumod, activo: response.data.activo});
                    me.portfolioartists = me.portfolios.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closePortfolio();
                    me.snacktext = 'Created';
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
        openTab: function (link) {
            this.dependentWindow = window.open(link, '_blank')
        },
        editNote(element){
            this.editedIndex = this.notes.indexOf(element)
            this.note = element.text
            this.noteCRUDdialog = true
        },
        closeNote(){
            this.editedIndex = -1
            this.note = ''
            this.noteCRUDdialog = false
        },
        deleteNote(element){
            this.editedIndex = this.notes.indexOf(element)
            this.note = element.text
            this.dialogDeleteNote = true
        },
        closeDeleteNote(){
            this.dialogDeleteNote = false
            this.note = ''
            this.editedIndex = -1
        },
        deleteNoteConfirm(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.delete('api/Notes/Eliminar/'+me.notes[me.editedIndex].value,configuracion).then( () => {
                me.notes = me.notes.filter(x => x.value != me.notes[me.editedIndex].value);
                me.noteartists = me.notes.filter(e => e.artistid === me.workedartistid)
                me.fillSnowflake(me.artists);
                me.closeDeleteNote;
                me.snacktext = 'Eliminated';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        saveNote(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            //console.log(me.editedIndex, me.note)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Notes/Actualizar',{
                    'id': me.notes[me.editedIndex].value,
                    'note': me.note,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.notes[me.editedIndex].text = response.data.note
                    me.notes[me.editedIndex].iduserumod = response.data.iduserumod
                    me.notes[me.editedIndex].fecumod = response.data.fecumod
                    me.noteartists = me.notes.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeNote();
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                axios.post('api/Notes/Crear',{
                    'artistid': me.workedartistid,
                    'note': me.note,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.notes.push({selected: false, value: response.data.id, artistid: response.data.artistid, text: response.data.note,
                        iduseralta: response.data.iduseralta, fecalta: response.data.fecalta, iduserumod: response.data.iduserumod, fecumod: response.data.fecumod, activo: response.data.activo});
                    me.noteartists = me.notes.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeNote();
                    me.snacktext = 'Created';
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
        editSchedule(element){
            this.editedIndex = this.schedules.indexOf(element)
            this.startdate = element.startdate
            this.enddate = element.enddate
            this.reason = element.reason
            this.dates = []
            this.dates.push(this.startdate.substr(0,10),this.enddate.substr(0,10))
            this.scheduleCRUDdialog = true
        },
        closeSchedule(){
            this.editedIndex = -1
            this.startdate = ''
            this.enddate = ''
            this.reason = ''
            this.dates = []
            this.scheduleCRUDdialog = false
        },
        deleteSchedule(element){
            this.editedIndex = this.schedules.indexOf(element)
            this.startdate = element.startdate
            this.enddate = element.enddate
            this.reason = element.reason
            this.dates = []
            this.dates.push(this.startdate.substr(0,10),this.enddate.substr(0,10))
            this.dialogDeleteSchedule = true
        },
        closeDeleteSchedule(){
            this.dialogDeleteSchedule = false
            this.startdate = ''
            this.enddate = ''
            this.reason = ''
            this.dates = []
            this.editedIndex = -1
        },
        deleteScheduleConfirm(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.delete('api/Schedules/Eliminar/'+me.schedules[me.editedIndex].value,configuracion).then( () => {
                me.schedules = me.schedules.filter(x => x.value != me.schedules[me.editedIndex].value);
                me.scheduleartists = me.schedules.filter(e => e.artistid === me.workedartistid)
                me.fillSnowflake(me.artists);
                me.closeDeleteSchedule;
                me.snacktext = 'Eliminated';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        saveSchedule(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            //console.log(me.editedIndex, me.reason)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Schedules/Actualizar',{
                    'id': me.schedules[me.editedIndex].value,
                    'startdate': me.dates[0],
                    'enddate': me.dates[1],
                    'reason': me.reason,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.schedules[me.editedIndex].startdate = response.data.startdate
                    me.schedules[me.editedIndex].enddate = response.data.enddate
                    me.schedules[me.editedIndex].reason = response.data.reason
                    me.schedules[me.editedIndex].iduserumod = response.data.iduserumod
                    me.schedules[me.editedIndex].fecumod = response.data.fecumod
                    me.scheduleartists = me.schedules.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeSchedule();
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                axios.post('api/Schedules/Crear',{
                    'artistid': me.workedartistid,
                    'startdate': me.dates[0],
                    'enddate': me.dates[1],
                    'reason': me.reason,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.schedules.push({selected: false, value: response.data.id, artistid: response.data.artistid, 
                        startdate: response.data.startdate, enddate: response.data.enddate, reason: response.data.reason,
                        iduseralta: response.data.iduseralta, fecalta: response.data.fecalta, iduserumod: response.data.iduserumod, fecumod: response.data.fecumod, activo: response.data.activo});
                    me.scheduleartists = me.schedules.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeSchedule();
                    me.snacktext = 'Created';
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

        editRating(element){
            this.editedIndex = this.ratings.indexOf(element)
            this.score = element.score
            this.projectname = element.projectname
            this.ratingCRUDdialog = true
        },
        closeRating(){
            this.editedIndex = -1
            this.score = 0
            this.score = ''
            this.ratingCRUDdialog = false
        },
        deleteRating(element){
            this.editedIndex = this.ratings.indexOf(element)
            this.score = element.score
            this.projectname = element.projectname
            this.dialogDeleteRating = true
        },
        closeDeleteRating(){
            this.dialogDeleteRating = false
            this.score = 0
            this.score = ''
            this.editedIndex = -1
        },
        deleteRatingConfirm(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.delete('api/Ratings/Eliminar/'+me.ratings[me.editedIndex].value,configuracion).then( () => {
                me.ratings = me.ratings.filter(x => x.value != me.ratings[me.editedIndex].value);
                me.ratingartists = me.ratings.filter(e => e.artistid === me.workedartistid)
                me.fillSnowflake(me.artists);
                me.closeDeleteRating;
                me.snacktext = 'Eliminated';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        saveRating(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            //console.log(me.editedIndex, me.rating)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Ratings/Actualizar',{
                    'id': me.ratings[me.editedIndex].value,
                    'rating': me.rating,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.ratings[me.editedIndex].text = response.data.rating
                    me.ratings[me.editedIndex].iduserumod = response.data.iduserumod
                    me.ratings[me.editedIndex].fecumod = response.data.fecumod
                    me.ratingartists = me.ratings.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeRating();
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                axios.post('api/Ratings/Crear',{
                    'artistid': me.workedartistid,
                    'rating': me.rating,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.ratings.push({selected: false, value: response.data.id, artistid: response.data.artistid, text: response.data.rating,
                        iduseralta: response.data.iduseralta, fecalta: response.data.fecalta, iduserumod: response.data.iduserumod, fecumod: response.data.fecumod, activo: response.data.activo});
                    me.ratingartists = me.ratings.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeRating();
                    me.snacktext = 'Created';
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





        tratarProyectos(item){
            var me = this;
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
                    index = me.proyectos.findIndex(element => element.value === me.proyectousuarios[i].proyectoid )
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
            index = me.proyectos.findIndex(element => element.value === item.value );
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
            this.adNombre=item.fullname;
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
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Artists/Activar/'+me.adId,{},configuracion).then( () => {
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
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Artists/Desactivar/'+me.adId,{},configuracion).then( () => {
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
