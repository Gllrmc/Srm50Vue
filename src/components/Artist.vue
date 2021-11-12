<template>
    <v-row align="start" style="overflow: auto">
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
            ref="maintable"
            v-model="selected"
            :headers="headerartists"
            :items="artists"
            :footer-props="{
                showFirstLastPage: true,
                'first-icon': 'mdi-arrow-collapse-left',
                'last-icon': 'mdi-arrow-collapse-right',
                'prev-icon': 'mdi-minus',
                'next-icon': 'mdi-plus',
                'items-per-page-text':'Artists per page',
                'items-per-page-options': [5, 10, 30, 50, 100],
                'show-current-page': true,
            }"
            :items-per-page="30"
            :search="searcha"
            item-key="id"
            show-select
            multi-sort
            class="elevation-1 blue-grey lighten-5"
            no-data-text="Nothing to show"
            height="800px"
            >
                <!-- <template v-slot:[`header.mainrole`]="{ header }">
                {{ header.text }}
                <v-menu offset-y :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon small :color="roleFilterValues.length ? 'accent' : ''">
                        mdi-filter
                        </v-icon>
                    </v-btn>
                    </template>
                    <div style="background-color: white; width: 280px">
                    <v-select
                        v-model="roleFilterValues"
                        :items="roles"
                        label="Main Role"
                        append-icon="mdi-magnify-plus-outline"
                        clearable
                        chips
                        deletable-chips
                        multiple
                        class="elevation-1"
                        >
                    </v-select>
                    </div>
                </v-menu>
                </template> -->
                <template v-slot:[`header._skillartisttxs`]="{ header }">
                {{ header.text }}
                </template>
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>Artists</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <tr>
                            <td>
                                <v-btn 
                                    color="primary" dark 
                                    class="mb-2 ma-1"
                                    @click="tratarPreview()">
                                    PRE-SELECT
                                </v-btn>
                            </td>
                            <td>
                                <export-excel
                                    :data   = "json_data"
                                    :fields = "json_fields"
                                    worksheet = "Artist Export"
                                    type    = "xls"
                                    name    = "MAnAdata.xls"
                                    >
                                    <v-btn 
                                        color="primary" dark 
                                        class="mb-2 ma-1"
                                        @click="crearXLS()">
                                        EXPORT
                                    </v-btn>
                                </export-excel>
                            </td>
                            <!-- <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn 
                                            x-small 
                                            class="mr-1" 
                                            :disabled="!selected.length" 
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="crearPDF()">
                                            <v-icon>
                                                mdi-printer
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Contact List</span>
                                </v-tooltip>
                            </td> -->
                        </tr>
                        <v-spacer></v-spacer>
                        <div class="mb-2 ma-1" style="background-color: white; width: 280px">
                            <v-select
                                v-model="skillFilterValues"
                                :items="skillsfilter"
                                label="Choose Skills"
                                append-icon="mdi-magnify-plus-outline"
                                clearable
                                chips
                                deletable-chips
                                multiple
                                class="elevation-1"
                                >
                            </v-select>
                        </div>
                        <div class="mb-2 ma-1" style="background-color: white; width: 280px">
                            <v-select
                                v-model="skillFilterValues2"
                                :items="skillsfilter"
                                label="Choose combined Skills"
                                append-icon="mdi-magnify-plus-outline"
                                clearable
                                chips
                                deletable-chips
                                multiple
                                class="elevation-1"
                                >
                            </v-select>
                        </div>
                        <div class="mb-2 ma-1" style="background-color: white; width: 400px">
                            <v-text-field class="mb-2 ma-1" dense label="Search" v-model="searcha" clearable append-icon="mdi-magnify" single-line hide-details></v-text-field>
                        </div>
                        <div class="mb-2 ma-2" style="background-color: white; width: 280px">
                            <!-- <v-text-field class="mb-2 ma-1" dense label="Search" v-model="searcha" clearable append-icon="mdi-calendar" single-line hide-details></v-text-field> -->
                            <v-menu
                            ref="menus"
                            v-model="menus"
                            :close-on-content-click="false"
                            :return-value.sync="searchdates"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                :value="dateRangeSearchd"
                                clearable
                                label="Date range"
                                append-icon="mdi-calendar"
                                readonly
                                @click:clear="clearAvailability()"
                                v-bind="attrs"
                                v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="searchdates"
                                color="primary"
                                range
                                no-title
                                scrollable
                                :min="nowDate"
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                text
                                color="primary"
                                @click="menus = false"
                                >
                                Cancel
                                </v-btn>
                                <v-btn
                                text
                                color="primary"
                                @click="fillAvailability(searchdates.sort())"
                                >
                                OK
                                </v-btn>
                            </v-date-picker>
                            </v-menu>
                        </div>

                        <!-- <v-menu offset-y :close-on-content-click="false">
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon small :color="skillFilterValues.length ? 'accent' : ''">
                                mdi-filter
                                </v-icon>
                            </v-btn>
                            </template>
                            <div style="background-color: white; width: 280px">
                            <v-select
                                v-model="skillFilterValues"
                                :items="skillsfilter"
                                label="Skills"
                                append-icon="mdi-magnify-plus-outline"
                                clearable
                                chips
                                deletable-chips
                                multiple
                                class="elevation-1"
                                >
                            </v-select>
                            </div>
                        </v-menu> -->

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="700px">
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
                                                <v-col cols="12" sm="8" md="8">
                                                    <v-text-field 
                                                        dense 
                                                        v-model="fullname" 
                                                        label="Full Name" 
                                                        :rules="fullnameRules"
                                                        counter="64"
                                                    />
                                                </v-col>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-select 
                                                        dense 
                                                        v-model="mainroleid"
                                                        :items="roles" 
                                                        label="Main Role"
                                                        />
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field 
                                                        dense 
                                                        v-model="dailyrate"
                                                        label="Daily rate"
                                                        counter="128"
                                                    />
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <div class="text-center">
                                                        <v-rating
                                                        v-model="rating"
                                                        background-color="orange lighten-3"
                                                        color="orange"
                                                        ></v-rating>
                                                    </div>
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
                                                        <v-icon >
                                                            mdi-image-frame
                                                        </v-icon>    
                                                    </v-btn>
                                                    <v-btn class="mx-2" small fab color="primary" @click="clearImagen">
                                                        <v-icon >
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
                        <v-dialog 
                            v-model="checkindialog" 
                            max-width="400px"
                            persistent
                        >
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Create Pre-select</span>
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
                                                        v-model="checkin" 
                                                        label="Pre-select" 
                                                        :rules="checkinRules"
                                                        counter="32"
                                                    />
                                                </v-col>
                                                <!-- <v-col cols="12" sm="12" md="12">
                                                    <v-text-field
                                                        dense
                                                        v-model="detail"
                                                        label="Detail"
                                                        :rules="detailRules"
                                                        counter="256"
                                                    />
                                                </v-col> -->
                                            </v-row>
                                        </v-container>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" text @click="checkindialog=false">CANCEL</v-btn>
                                    <v-btn color="secondary" dark :disabled="!validForm" text @click="guardarCheckin">SAVE</v-btn>
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
                        <v-dialog persistent v-model="skilldialog" max-width=500>
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
                        <v-dialog persistent v-model="portfoliodialog" max-width=700>
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
                                                class="ma-1"
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
                                        <v-btn class="ma-1" color="primary" dense dark @click.native="portfoliodialog=false">Close</v-btn>
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
                        <v-dialog persistent v-model="contactdialog" max-width=700>
                            <v-data-table
                                :headers="headercontact"
                                :items="contactartists"
                                sort-by="text"
                                class="elevation-1"
                                :items-per-page="5"
                            >
                                <template v-slot:top>
                                    <v-toolbar
                                        flat
                                    >
                                        <v-toolbar-title>Contact info of {{contactheader}}</v-toolbar-title>
                                        <v-divider
                                        class="mx-4"
                                        inset
                                        vertical
                                        ></v-divider>
                                        <v-spacer/>
                                        <v-dialog
                                            v-model="contactCRUDdialog"
                                            max-width="600px"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                color="primary"
                                                dark
                                                class="ma-1"
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                NEW
                                                </v-btn>
                                            </template>
                                            <v-card>
                                                <v-card-title>
                                                    <p class="text-h5">{{ formTitleContact }} for {{ contactheader }}</p>
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-form
                                                    ref="portfolioform"
                                                    v-model="validcontactform"
                                                    >
                                                        <v-container>
                                                            <v-col
                                                                cols="12"
                                                                sm="12"
                                                                md="12"
                                                            >
                                                                <v-text-field
                                                                v-model="contact"
                                                                label="Contact Instance"
                                                                :rules="contactRules"
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
                                                        @click="closeContact"
                                                    >
                                                        Cancel
                                                    </v-btn>
                                                    <v-btn
                                                        color="primary"
                                                        text
                                                        :disabled ="!validcontactform"
                                                        @click="saveContact"
                                                    >
                                                        Save
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn class="ma-1" color="primary" dense dark @click.native="contactdialog=false">Close</v-btn>
                                        <v-dialog v-model="dialogDeleteContact" max-width="520px">
                                        <v-card>
                                            <v-card-title class="text-h5">Are you sure you want to delete this item?
                                            </v-card-title>
                                            <p class="ml-3" >{{contact}}</p>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="closeDeleteContact">Cancel</v-btn>
                                            <v-btn color="primary" text @click="deleteContactConfirm">OK</v-btn>
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
                                    @click="editContact(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteContact(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                            </v-data-table>
                        </v-dialog>
                        <v-dialog persistent v-model="notedialog" max-width=700>
                            <v-data-table
                                :headers="headernotes"
                                :items="noteartists"
                                sort-by="fecumod"
                                sort-desc
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
                                            class="ma-1"
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
                                    <v-btn class="ma-1" color="primary" dense dark @click.native="notedialog=false">Close</v-btn>
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
                        <v-dialog persistent v-model="scheduledialog" max-width=700>
                            <v-data-table
                                :headers="headerschedules"
                                :items="scheduleartists"
                                sort-by="fecumod"
                                sort-desc
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
                                            class="ma-1"
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
                                                                v-model="comment"
                                                                label="Comment"
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
                                    <v-btn class="ma-1" color="primary" dense dark @click.native="scheduledialog=false">Close</v-btn>
                                    <v-dialog v-model="dialogDeleteSchedule" max-width="570px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this schedule?
                                        </v-card-title>
                                        <p class="ml-3" >{{ dateRangeText }} {{comment}}</p>
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
                                <template v-slot:[`item.comment`]="{ item }">
                                    {{ item.comment}}
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
                        <span>Edit {{item.fullname}}</span>
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
                        <span>Delete {{item.fullname}}</span>
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
                        <span>Act/Ina {{item.fullname}}</span>
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
                <template v-slot:[`item.mainrole`]="{ item }">
                    <v-edit-dialog
                        :return-value.sync="item.mainrole"
                        large
                        persistent
                        @save="save(item)"
                        @cancel="cancel"
                        @open="open"
                        @close="close"
                        >
                        <div>{{ item.mainrole }}</div>
                        <template v-slot:input>
                            <div class="mt-4 text-h6">
                                Update Main Role
                            </div>
                            <v-select
                                dense
                                :disabled="!item.activo"
                                v-model="item.mainroleid"
                                :items="roles"
                                label="Inline Edition"
                                autofocus
                            ></v-select>
                        </template>
                    </v-edit-dialog>                    
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
                        <a v-if="item._portfolios && item._portfolios.split(' ').length">
                            <a v-for="(elem, i) in item._portfolios.split(' ')"
                            :key="i"
                            @click="openTab(elem)"
                            >
                                {{ elem }}
                            </a>
                        </a>
                        <p v-else>No portfolio found</p>
                    </td>
                </template>
                <template v-slot:[`item._contacts`]="{ item }">
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                :disabled="!item.activo"
                                x-small
                                class="mr-1"
                                v-bind="attrs"
                                v-on="on"
                                @click="tratarContact(item)"
                                >
                                mdi-details
                                </v-icon>
                            </template>
                            <span>Manage Contact info</span>
                        </v-tooltip>
                    </td>
                    <td>
                        <a v-if="item._contacts && item._contacts.split(' ').length">
                            <a v-for="(elem, i) in item._contacts.split(' ')"
                            :key="i"
                            @click="openTab(elem)"
                            >
                                {{ elem }}
                            </a>
                        </a>
                        <p v-else>No contact info found</p>
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
                    <td
                     v-if="item._schedules">
                        <v-menu
                            open-on-hover
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <p
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{item._schedules}}
                                </p>
                            </template>
                            <v-date-picker
                            v-model="item.busydates"
                            no-title
                            multiple
                            readonly
                            :min="nowDate"
                            elevation="15"
                            >
                            </v-date-picker>
                        </v-menu>
                    </td>
                </template>
                <template v-slot:[`item.availability`]="{ item }">
                    <td v-if="dateRangeSearchd">
                        {{ parseFloat( item.availability * 100 ).toFixed(0)+'%' }}
                    </td>
                </template>
                <!-- <template v-slot:[`item.events`]="{ item }">
                    <div class="text-center">
                        <v-menu
                        open-on-hover
                        top
                        offset-y
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                v-bind="attrs"
                                v-on="{ on }"
                                >
                                {{ item.busydates }}
                                </v-btn>
                            </template>
                            <v-sheet height="400">
                                <v-calendar
                                    ref="calendar"
                                    type="month"
                                    color="primary"
                                    :events="item.events"
                                ></v-calendar>
                            </v-sheet>
                        </v-menu>
                    </div>
                </template> -->
                <template v-slot:[`item.dailyrate`]="{ item }">
                    <v-edit-dialog
                    :return-value.sync="item.dailyrate"
                    large
                    persistent
                    @save="save(item)"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                    >
                    {{ item.dailyrate }}
                    <template v-slot:input>
                        <div class="mt-4 text-h6">
                            Update Daily rate
                        </div>
                        <v-text-field
                        v-model="item.dailyrate"
                        :rules="dailyrateRules"
                        label="Daily rates"
                        hint="Inline Edition"
                        single-line
                        counter="128"
                        ></v-text-field>
                    </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.rating`]="{ item }">
                    <v-edit-dialog
                    :return-value.sync="item.rating"
                    large
                    persistent
                    @save="save(item)"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                    >
                        <div class="text-center">
                            <v-rating
                            v-model="item.rating"
                            background-color="orange lighten-3"
                            color="orange"
                            small
                            readonly
                            ></v-rating>
                        </div>
                        <template v-slot:input>
                            <div class="mt-4 text-h6">
                                Update Rating
                            </div>
                            <div class="text-center">
                                <v-rating
                                v-model="item.rating"
                                background-color="orange lighten-3"
                                color="orange"
                                ></v-rating>
                            </div>
                        </template>
                    </v-edit-dialog>
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
//   import jsPDF from 'jspdf'


  export default {
      data: () => ({
        json_fields: {},
        json_data: [],
        json_meta: [
        [
            {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ],                    
        validForm: false,
        validportfolioform: false,
        validcontactform: false,
        validnoteform: false,
        validscheduleform: false,
        menu: false,
        menus: false,
        nowDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10),
        fullnameRules: [
            v => !!v || 'Full Name is required',
            v => (v && v.length > 0 && v.length <= 64) || 'Exceeds 64 characters',
        ],
        urlRules: [
            v => !!v || 'URL is required',
            v => (v && v.length > 0 && v.length <= 128) || 'Exceeds 128 characters',
            v => !(/[ ]/.test(v)) || 'no spaces allowed',
        ],
        noteRules: [
            v => !!v || 'Note is required',
            v => ( v && v.length > 0 && v.length <= 128) || 'Exceeds 512 characters',
        ],
        projectnameRules: [
            v => !!v || 'Project name is required',
            v => ( v && v.length <= 32) || 'Exceeds 32 characters',
        ],
        dailyrateRules: [
            v => ( !!v.length == 0 || v.length <= 128) || 'Exceeds 128 characters',
        ],
        contactRules: [
            v => !!v || 'Contact info is required',
            v => ( !!v.length == 0 || v.length <= 128) || 'Exceeds 128 characters',
        ],
        ratingRules: [
            v => (v && v.length > 0 && v.length <= 1) || 'Exceeds 1 digit',
            v => (v && v > 0 && v < 6) || 'Valid range 1 to 5',
        ],
        checkinRules: [
            v => !!v || 'Checkin text is required',
            v => ( !!v.length == 0 || v.length <= 32) || 'Exceeds 32 characters',
        ],
        detailRules: [
            v => ( !!v.length == 0 || v.length <= 256) || 'Exceeds 32 characters',
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
        dependentWindow: '',
        searcha: '',
        searchs: '',
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        selected: [],
        // roleFilterValues: [],
        skillFilterValues: [],
        skillFilterValues2: [],
        artists: [],
        schedules: [],
        _shcedules: '',
        scheduleartists: [],
        skills: [],
        skillsfilter: [],
        _skillartistids: [],
        _skillartisttxs: [],
        skillartists: [],
        roles: [],
        portfolios: [],
        _portfolios: '',
        portfolioartists: [],
        contacts: [],
        _contacts: '',
        contactartists: [],
        notes: [],
        _notes: '',
        noteartists: [],
        selections: [],
        selectedartists: [],
        usuarios: [],
        id: '',
        fullname: '',
        mainroleid: '',
        dailyrate: '',
        rating: '',
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
        checkin: '',
        checkindialog: false,
        detail: '',
        portfoliodialog: false,
        portfolioCRUDdialog: false,
        dialogDeletePortfolio: false,
        portfolioheader: '',
        url: '',
        contactdialog: false,
        contactCRUDdialog: false,
        dialogDeleteContact: false,
        contactheader: '',
        contact: '',
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
        searchdates: [],
        comment: '',
        projectname: '',
        score: 0,
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: '',
        // events: [],
        filterDates: [],
        daysinrangefilter: 0,
        startrangefilter: '',
        endrangefilter: '',
    }),

    computed: {
        dateRangeText () {
            return this.dates?this.dates.join('/'):''
        },
        dateRangeSearchd () {
            return this.searchdates?this.searchdates.join('/'):''
        },
        headerartists(){
            return [
                { text: 'Avatar', value: 'imgartist', align: 'center', sortable: false },
                { text: 'Full Name', value: 'fullname', align: 'start', sortable: true, width: 250 },
                //{ text: 'Main Role Ids', value: 'mainroleid', align: 'start', sortable: true },
                { text: 'Occupation', value: 'mainrole', align: 'start', sortable: true },
                //{ text: 'Skills Ids', value: '_skillartistids', align: 'start', sortable: true },
                { text: 'Skills', value: '_skillartisttxs', align: 'start', sortable: true, width: 250, filter: this.skillFilter },
                { text: 'Portfolio', value: '_portfolios', align: 'start', sortable: true },
                { text: 'Notes', value: '_notes', align: 'start', sortable: true, width: 350 },
                { text: 'Commitments', value: '_schedules', align: 'start', sortable: true, width: 300 },
                // { text: 'Events', value: 'events', align: 'start', sortable: true, width: 300 },
                { text: 'Availabitilty', value: 'availability', align: 'start', sortable: true },
                { text: 'Daily rate', value: 'dailyrate', align: 'start', sortable: true, width: 250 },
                { text: 'Rating', value: 'rating', align: 'center', sortable: true },
                { text: 'Contact info', value: '_contacts', align: 'start', sortable: true, width: 200 },
                { text: 'Status', value: 'activo', align: 'start', sortable: true  },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 200 },
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
        headercontact(){
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
                { text: 'Comment', value: 'comment', align: 'start', sortable: true },
                { text: '[Options]', value: 'actions', align: 'center', sortable: false, width: 100 },
            ]
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Artist' : 'Update Artist'
        },
        formTitlePortfolio () {
            return this.editedIndex === -1 ? 'New Portfolio' : 'Update Portfolio'
        },
        formTitleContact () {
            return this.editedIndex === -1 ? 'New contact info' : 'Update contact info'
        },
        formTitleNote () {
            return this.editedIndex === -1 ? 'New Note' : 'Update Note'
        },
        formTitleSchedule () {
            return this.editedIndex === -1 ? 'New Range' : 'Update Range'
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
        salir(){
            this.$store.dispatch("salir");
        },
        // roleFilter(value) {
        //     // If this filter has no value we just skip the entire filter
        //     if (this.roleFilterValues.length==0) {
        //     return true;
        //     }
        //     // Check if the current loop value (The calories value)
        //     // equals to the selected value at the <v-select>.
        //     value = value.split(', ')
        //     var valueids = value.map( txt => this.roles.find(e => e.text === txt).value)
        //     return this.roleFilterValues.find(e => valueids.indexOf(e) > -1);
        // },
        skillFilter(value) {
            // If this filter has no value we just skip the entire filter
            var i = 0
            var j = 0
            var i2 = 0
            var j2 = 0
            if (this.skillFilterValues.length==0 && this.skillFilterValues2.length==0){
                return true;
            } else if (this.skillFilterValues2.length==0){
                value = value.split(', ')
                for ( i = 0; i < value.length; i++ ){
                    for ( j = 0; j < this.skillFilterValues.length; j++ ){
                        if ( value[i] == this.skillFilterValues[j] ){
                            return true
                        }
                    }
                }
            } else if (this.skillFilterValues.length==0){
                value = value.split(', ')
                for ( i2 =0; i2<value.length; i2++ ){
                    for ( j2 = 0; j2 < this.skillFilterValues2.length; j2++ ){
                        if ( value[i2] == this.skillFilterValues2[j2] ){
                            return true
                        }
                    }
                }
            } else {
                value = value.split(', ')
                for ( i = 0; i < value.length; i++ ){
                    for ( j = 0; j < this.skillFilterValues.length; j++ ){
                        if ( value[i] == this.skillFilterValues[j] ){
                            for ( i2 =0; i2<value.length; i2++ ){
                                for ( j2 = 0; j2 < this.skillFilterValues2.length; j2++ ){
                                    if ( value[i2] == this.skillFilterValues2[j2] ){
                                        return true
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // Check if the current loop value (The skil value)
            // equals to the selected value at the <v-select>.
            return false
        },
        save (elem) {
            if (elem.activo){
                let me = this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Artists/Actualizar',{
                    'id': elem.id,
                    'fullname': elem.fullname,
                    'mainroleid': elem.mainroleid,
                    'dailyrate': elem.dailyrate,
                    'rating': elem.rating,
                    'imgartist':elem.imgartist,
                    'proveedorid':elem.proveedorid,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    me.editedIndex = me.artists.findIndex(x => x.id === elem.id)
                    me.artists[me.editedIndex].mainrole = me.skills.find(x => x.value === response.data.mainroleid).text
                    me.snacktext = 'Updated';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.closedialog();
                    me.limpiar();
                }).catch(function(error){
                    me.snacktext = 'An error was detected. Code: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                });
            } else {
            this.snacktext = 'Dormant'
            this.snackcolor = "error";
            this.snackbar = true;
            }
        },
        cancel () {
            this.snacktext = 'Canceled'
            this.snackcolor = "error";
            this.snackbar = true;
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
        crearXLS(){
            this.json_fields = {
                'Full Name': 'fullname',
                'Occupation': 'mainrole',
                'Skills': '_skillartisttxs',
                'Portfolio': '_portfolios',
                'Notes' : '_notes',
                'Commitments' : '_schedules',
                'Availability' : 'availability',
                'Daily rate': 'dailyrate',
                'Rating': 'rating',
                'Contact info': '_contacts',
                'Last update': {field: 'fecumod',
                    callback: (value) => {return value.substr(0,10) + ' ' + value.substr(11,5)}
                },
                //'Active': 'activo',
            },
            this.json_data = this.selected.length===0?(this.$refs.maintable.$children[0].filteredItems.filter(e => e.activo === true )):(this.selected.filter(e => e.activo === true ));
        },
        // crearPDF(){
        //     var columns = [
        //             {title: "Fullname", dataKey: "fullname"},
        //             {title: "Main Role", dataKey: "mainrole"},
        //             //{title: "Skills", dataKey: "_skillartisttxs"},
        //             //{title: "Portfolio", dataKey: "_portfolios"},
        //             //{title: "Notes", dataKey: "_notes"},
        //             //{title: "Availability", dataKey: "_schedules"},
        //             //{title: "Daily rate", dataKey: "dailyrate"},
        //             //{title: "Rating", dataKey: "rating"},
        //             {title: "Contact info", dataKey: "_contact"},
        //             //{title: "Active", dataKey: "activo"}
        //     ];
        //     var rows = [];

        //     this.selected.map(function(x){
        //             rows.push({fullname:x.fullname, mainrole:x.mainrole, _skillartisttxs:x._skillartisttxs, _portfolios:x._portfolios, 
        //             _contacts:x._contacts, _notes:x._notes, _schedules:x._schedules, rating: x.rating, dailyrate:x.dailyrate,
        //             activo:x.activo});
        //     });

        //     // Only pt supported (not mm or in)
        //     var doc = new jsPDF('l', 'pt');
        //     doc.autoTable(columns, rows.filter(e => e.activo === true), {
        //         margin: {top: 60},
        //         addPageContent: () => {
        //             doc.text("Artist Contact List", 40, 30);
        //         }
        //     });
        //     doc.save('ArtistCallList.pdf');
        // },
        listar(){
            let me = this
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Artists/Listar',configuracion).then(function(response){
                //console.log(response);
                me.artists=response.data
                me.$nextTick(() => {
                    me.fillSnowflake(me.artists)
                })                
                me.$nextTick(() => {
                    let trick = me.artists[0]
                    me.artists.splice( 0, 1, trick)
                })                
                // setTimeout(() => {
                //     me.fillSnowflake(me.artists)
                //     let trick = me.artists[0]
                //     me.artists.splice( 0, 1, trick)
                // }, 1000)
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        fillSnowflake(items){
            let me = this
            var filtered=[],busy=[],los="",sos="",index="",nots="",pors="",cons="",sche="",overlap=0
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
                //busca Contacts
                filtered = me.contacts.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var co = 0 ; co < filtered.length; co++ ){
                    cons += filtered[co].text+', '
                }
                items[i]._contacts = cons.length>128?cons.substr(0,128):cons.substring(0, cons.length - 2)
                cons = ''
                // Arma Schedule
                filtered = me.schedules.filter( function(e) {
                    return e.artistid === items[i].id
                })
                for (var sc = 0 ; sc < filtered.length; sc++ ){
                    sche += "[" + filtered[sc].startdate.substr(0,10) + '/' + filtered[sc].enddate.substr(0,10) + "] " + filtered[sc].comment + ", "
                    busy = [ ...busy, ...me.getDaysArr(filtered[sc].startdate.substr(0,10),filtered[sc].enddate.substr(0,10))]
                }
                items[i]._schedules = sche.length>128?sche.substr(0,128):sche.substr(0, sche.length - 2)
                items[i].busydates = [...busy].sort()
                sche = ''
                // Arma Availability
                if (me.daysinrangefilter){
                    overlap = busy.filter(x => x>=me.startrangefilter && x<=me.endrangefilter).length
                    items[i].availability = (me.daysinrangefilter - overlap) / me.daysinrangefilter
                } else {
                    items[i].availability = ''
                }
                busy = []
            }
        },
        fillAvailability(daterange){
            let me = this
            me.$refs.menus.save(daterange)
            me.filterDates = [...me.getDaysArr (daterange[0],daterange[1])]
            me.startrangefilter = daterange[0]
            me.endrangefilter = daterange[1]
            me.daysinrangefilter = me.filterDates.length
            //console.log(me.daysinrangefilter,me.startrangefilter,me.endrangefilter)
            me.fillSnowflake(me.artists)
        },
        clearAvailability(){
            let me = this
            me.$refs.menus.save('')
            me.searchdates=[]
            me.filterDates = []
            me.startrangefilter = null
            me.endrangefilter = null
            me.daysinrangefilter = 0
            //console.log(me.daysinrangefilter,me.startrangefilter,me.endrangefilter)
            me.fillSnowflake(me.artists)
        },
        getDaysArr (start, end) {
            for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
                arr.push(new Date(dt).toISOString().slice(0,10))
            }
            return arr
        },        
        select(){
            let me = this;
            let usuariosArray = []
            let skillsArray = []
            let skillartistsArray = []
            let notesArray = []
            let portfoliosArray = []
            let contactsArray = []
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
                if ( error.response.status == 401 ){
                    me.salir();
                }
            });
            axios.get('api/Portfolios/Listar',configuracion).then(function(response){
                portfoliosArray=response.data;
                portfoliosArray.map(function(x){
                    me.portfolios.push({value:x.id, artistid: x.artistid, text: x.url, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
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
                    me.skillsfilter.push({text: x.skill, ismainrole: x.ismainrole });
                    me.roles = me.skills.filter(e => e.ismainrole)
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
                    me.skillartists.push({value: x.id, skillid: x.skillid, artistid: x.artistid, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Contacts/Listar',configuracion).then(function(response){
                contactsArray=response.data;
                contactsArray.map(function(x){
                    me.contacts.push({value:x.id, artistid: x.artistid, text: x.contact, iduseralta: x.iduseralta,
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
                        comment: x.comment, iduseralta: x.iduseralta, fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
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
                    me.notes.push({value:x.id, artistid: x.artistid, text: x.note, iduseralta: x.iduseralta,
                        fecalta: x.fecalta, iduserumod: x.iduserumod, fecumod: x.fecumod, activo: x.activo });
                });
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        editItem (item) {
            this.id = item.id;
            this.fullname = item.fullname;
            this.mainroleid = item.mainroleid;
            this.dailyrate = item.dailyrate;
            this.rating = item.rating;
            this.imgartist = item.imgartist;
            this.imageUrl = item.imgartist;
            this.proveedorid = item.proveedorid;
            this.iduseralta = item.iduseralta;
            this.fecalta = item.fecalta;
            this.iduserumod = item.iduserumod;
            this.fecumod = item.fecumod;
            this.activo = item.activo;
            this.colfondo=item.colfondo;
            this.coltexto=item.coltexto;
            this.editedIndex = 1;
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
        limpiar(){
                this.id = ""
                this.fullname = ""
                this.mainroleid = ""
                this.dailyrate = ""
                this.rating = ""
                this.imgusario = ""
                this.imageUrl = ""
                this.proveedorid = ""
                this.iduseralta = ""
                this.fecalta = ""
                this.iduserumod = ""
                this.fecumod = ""
                this.activo = false
                this.editedIndex=-1
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
                    'mainroleid': me.mainroleid,
                    'dailyrate': me.dailyrate,
                    'rating': me.rating,
                    'imgartist': me.imgartist,
                    'proveedorid': me.proveedorid,
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
                    'mainroleid': me.mainroleid,
                    'dailyrate': me.dailyrate,
                    'rating': me.rating,
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
        tratarPreview(){
            this.checkin = ""
            this.detail = ""
            this.checkindialog = !this.checkindialog
        },
        guardarCheckin(){
            let me=this;
            var idpks = [];
            idpks = me.selected.map( function (eachobj) {return eachobj.id});
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.post('api/Checkinartists/Crearcheckinset',{
                'checkin': me.checkin,
                'detail': me.detail,
                'artistid':idpks,
                'iduseralta': me.$store.state.usuario.idusuario,
            },configuracion).then(function(){
                me.selected = [];
                me.checkindialog = false;
                me.snacktext = 'Created';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'An error was detected. Code: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
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
        tratarContact(element){
            var me = this;
            me.contactartists = me.contacts.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.contactheader = element.fullname;
            me.contactdialog=!me.contactdialog;
        },
        tratarNote(element){
            var me = this;
            me.noteartists = me.notes.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.noteheader = element.fullname;
            me.notedialog=!me.notedialog;
        },
        tratarSchedule(element){
            var me = this;
            me.scheduleartists = me.schedules.filter(e => e.artistid === element.id)
            me.workedartistid = element.id;
            me.scheduleheader = element.fullname;
            me.scheduledialog=!me.scheduledialog;
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
                    me.skillartists.push({skillid: response.data.skillid, artistid: response.data.artistid, value: response.data.id});
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
                me.closeDeletePortfolio();
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
                    me.portfolios.push({value: response.data.id, artistid: response.data.artistid, text: response.data.url,
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
        editContact(element){
            this.editedIndex = this.contacts.indexOf(element)
            this.contact = element.text
            this.contactCRUDdialog = true
        },
        closeContact(){
            this.editedIndex = -1
            this.contact = ''
            this.contactCRUDdialog = false
        },
        deleteContact(element){
            this.editedIndex = this.contacts.indexOf(element)
            this.contact = element.text
            this.dialogDeleteContact = true
        },
        closeDeleteContact(){
            this.dialogDeleteContact = false
            this.contact = ''
            this.editedIndex = -1
        },
        deleteContactConfirm(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            axios.delete('api/Contacts/Eliminar/'+me.contacts[me.editedIndex].value,configuracion).then( () => {
                me.contacts = me.contacts.filter(x => x.value != me.contacts[me.editedIndex].value);
                me.contactartists = me.contacts.filter(e => e.artistid === me.workedartistid)
                me.fillSnowflake(me.artists);
                me.closeDeleteContact();
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
        saveContact(){
            let me = this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            //console.log(me.editedIndex, me.contact)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Contacts/Actualizar',{
                    'id': me.contacts[me.editedIndex].value,
                    'contact': me.contact,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.contacts[me.editedIndex].text = response.data.contact
                    me.contacts[me.editedIndex].iduserumod = response.data.iduserumod
                    me.contacts[me.editedIndex].fecumod = response.data.fecumod
                    me.contactartists = me.contacts.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeContact();
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
                axios.post('api/Contacts/Crear',{
                    'artistid': me.workedartistid,
                    'contact': me.contact,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.contacts.push({value: response.data.id, artistid: response.data.artistid, text: response.data.contact,
                        iduseralta: response.data.iduseralta, fecalta: response.data.fecalta, iduserumod: response.data.iduserumod, fecumod: response.data.fecumod, activo: response.data.activo});
                    me.contactartists = me.contacts.filter(e => e.artistid === me.workedartistid)
                    me.fillSnowflake(me.artists);
                    me.closeContact();
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
            if (this.dependentWindow){
                this.closeTab()
            }
            this.dependentWindow = window.open(link, '_blank')
        },
        viewTab: function (link) {
            this.dependentWindow = window.open(link, 'mywin', "width=500, height=400")
        },
        closeTab: function () {
            this.dependentWindow.close()
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
                me.closeDeleteNote();
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
                    me.notes.push({value: response.data.id, artistid: response.data.artistid, text: response.data.note,
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
            this.comment = element.comment
            this.dates = []
            this.dates.push(this.startdate.substr(0,10),this.enddate.substr(0,10))
            this.scheduleCRUDdialog = true
        },
        closeSchedule(){
            this.editedIndex = -1
            this.startdate = ''
            this.enddate = ''
            this.comment = ''
            this.dates = []
            this.scheduleCRUDdialog = false
        },
        deleteSchedule(element){
            this.editedIndex = this.schedules.indexOf(element)
            this.startdate = element.startdate
            this.enddate = element.enddate
            this.comment = element.comment
            this.dates = []
            this.dates.push(this.startdate.substr(0,10),this.enddate.substr(0,10))
            this.dialogDeleteSchedule = true
        },
        closeDeleteSchedule(){
            this.dialogDeleteSchedule = false
            this.startdate = ''
            this.enddate = ''
            this.comment = ''
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
                me.closeDeleteSchedule();
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
            //console.log(me.editedIndex, me.comment)
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Schedules/Actualizar',{
                    'id': me.schedules[me.editedIndex].value,
                    'startdate': me.dates[0],
                    'enddate': me.dates[1],
                    'comment': me.comment,
                    'iduserumod': me.$store.state.usuario.idusuario,
                },configuracion).then( (response) => {
                    // eslint-disable-next-line
                    //debugger
                    me.schedules[me.editedIndex].startdate = response.data.startdate
                    me.schedules[me.editedIndex].enddate = response.data.enddate
                    me.schedules[me.editedIndex].comment = response.data.comment
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
                    'comment': me.comment,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.schedules.push({value: response.data.id, artistid: response.data.artistid, 
                        startdate: response.data.startdate, enddate: response.data.enddate, comment: response.data.comment,
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
