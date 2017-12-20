<template>
  <div>
    <b-modal 
      size="lg" 
      hide-header
      hide-footer
      id="addPersonModal" 
      ref="addPersonModal"
    >
      <h2 class="text-center" v-if="adding">Add New Person</h2>
      <h2 class="text-center" v-if="!adding">Update Person</h2>
      <hr>
      <b-form-group horizontal
        label="First Name:"
        label-class="text-sm-left"
        label-for="firstNameAdd">
        <b-form-input 
          v-model="person.firstName"
          id="firstNameAdd">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
        label="Last Name:"
        label-class="text-sm-left"
        label-for="lastNameAdd">
        <b-form-input 
          v-model="person.lastName"
          id="lastNameAdd">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
        label="Date of Birth:"
        label-class="text-sm-left"
        label-for="dateOfBirthAdd">
        <b-form-input
          id="dateOfBirthAdd"
          v-model="person.dateOfBirth"
          placeholder="MM/DD/YYYY"
          type="date"
          class="form-control" />
      </b-form-group>
      <b-form-group horizontal
        label="Addresses:"
        label-class="text-sm-left"
        label-for="addressesAdd"
        >
        <div v-for="(address, index) in person.addresses" id="addressesAdd">
          <vue-google-autocomplete
            :ref="'address' + index"
            :id="'map-' + index"
            classname="form-control"
            placeholder=""
            :value="address.value"
            v-on:placechanged="getAddressData"
            country="us"
          >
          </vue-google-autocomplete>
        </div>
        <b-button :variant="link" @click="addAddressInput('address')" style="font-size:inherit">Add Address</b-button>
        <b-button v-if="person.addresses.length > 0" :variant="link" @click="removeAddressInput('address')" style="font-size:inherit">Remove Address</b-button>
      </b-form-group>
      <b-form-group horizontal
        label="Emails:"
        label-class="text-sm-left"
        label-for="emailAddressesAdd"
        >
        <div v-for="(email, index) in person.emailAddresses" id="emailAddressesAdd">
          <b-form-input 
            type="text"
            v-model="person.emailAddresses[index].value"
          >
          </b-form-input>
          
        </div>
        <b-button :variant="link" @click="addAddressInput('email')" style="font-size:inherit">Add Email</b-button>
        <b-button v-if="person.emailAddresses.length > 1" :variant="link" @click="removeAddressInput('email')" style="font-size:inherit">Remove Email</b-button>
      </b-form-group>

      <b-form-group horizontal
        label="Phone Numbers:"
        label-class="text-sm-left"
        label-for="phoneNumbersAdd"
        >
        <div v-for="(phone, index) in person.phoneNumbers" id="phoneNumbersAdd">
          <the-mask 
            :mask="'+1 (###)-###-####'" 
            class="form-control"
            placeholder="+1 (XXX)-XXX-XXXX"
            v-model="person.phoneNumbers[index].value"
          />
        </div>
        <b-button :variant="link" @click="addAddressInput('phone')" style="font-size:inherit">Add Phone</b-button>
        <b-button v-if="person.phoneNumbers.length > 1" :variant="link" @click="removeAddressInput('phone')" style="font-size:inherit">Remove Phone</b-button>
      </b-form-group>
      <div class="offset-4">
        <b-button v-if="adding" :variant="success" @click="addNewPerson"> Add Person</b-button>	
        <b-button v-if="!adding" :variant="success" @click="updatePerson"> Update</b-button>						
      </div>
    </b-modal>
    <filter-bar></filter-bar>
    <vuetable ref="vuetable"
      api-url="http://localhost:8000/api/v1.0/people/"
      pagination-path=""
      :fields="fields"
      :css="css.table"
      :append-params="moreParams"
      @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" scope="props">   
        <div class="custom-actions text-center">
          <icon 
            name="edit"
            v-b-tooltip.hover title="Edit"
            v-on:click.native="onAction('edit-item', props.rowData, props.rowIndex)"
          ></icon>
          <icon 
            name="trash"
            v-b-tooltip.hover title="Delete"
            v-on:click.native="onAction('delete-item', props.rowData, props.rowIndex)"
          ></icon>
        </div>
      </template>
    </vuetable>
    <div class="clearfix pagination-section"> 
      <vuetable-pagination-custom ref="pagination"
        :css="css.pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination-custom>
    </div>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable'
  import VuetablePagination from 'vuetable-2/src/components/VuetablePaginationDropdown'
  import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
  import VuetablePaginationCustom from './VuetablePagination'
  import config from '../config';
  import CssConfig from './VuetableConfig.js'
  import FilterBar from './FilterBar'
  import Vue from 'vue'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    components: {
      FilterBar,
      Vuetable,
      VueGoogleAutocomplete,
      VuetablePaginationCustom,
      VuetablePaginationInfo
    },
    data: function () {
      return {  
        css: CssConfig,
        fields: [
          {
            name: 'first_name',
            title: 'First Name',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          },
          {
            name: 'last_name',
            title: 'Last Name',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          },
          {
            name: 'date_of_birth',
            title: 'Date of Birth',
            titleClass: 'd-none d-sm-none d-lg-table-cell',
            dataClass: 'd-none d-sm-none d-lg-table-cell'
          },
          {
            name: 'addresses',
            title: 'Addresses',
            titleClass: 'd-none d-sm-none d-md-table-cell',
            dataClass: 'd-none d-sm-none d-md-table-cell',
            callback: 'loadAddresses'
          },
          {
            name: 'email_addresses',
            title: 'Email Addresses',
            callback: 'loadList|email_address',
            titleClass: 'd-none d-sm-none d-md-table-cell',
            dataClass: 'd-none d-sm-none d-md-table-cell' 
          },
          
          {
            name: 'phone_numbers',
            title: 'Phone Numbers',
            titleClass: 'center aligned',
            dataClass: 'center aligned',
            callback: 'loadList|phone_number'
          },
          {
            name: '__slot:actions', 
            title: 'Actions',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          }
        ],
        moreParams: {},
        adding: true,
        success: 'success',
        link: 'link',
        currentPersonId: '',
        person: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          addresses: [
            {
              value: '',
              fromGoogle: true
            }
          ],
          phoneNumbers: [
            {
              value: ''
            }
          ],
          emailAddresses: [
            {
              value: ''
            }
          ]
        }
      }
    },
    mounted() {
      this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
      this.$events.$on('filter-reset', e => this.onFilterReset())
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onAction (action, data, index) {
        if(action === 'delete-item') {
          this.$http.delete(`http://localhost:8000/api/v1.0/people/${data.id}/?format=api`,{headers: {}}).then(response => {
            this.$refs.vuetable.reload()
          });
        }
        if(action === 'edit-item') {
          this.adding = false
          this.person.firstName = data.first_name
          this.person.lastName = data.last_name
          this.person.dateOfBirth = data.date_of_birth

          if(data.addresses.length > 0) {
            this.addresses = []
          }  
          for(var i = 0; i < data.addresses.length; i++) {
            this.person.addresses[i] = {
              value: data.addresses[i].street1,
            }
          }

          if(data.email_addresses.length > 0) {
            this.emailAddresses = []
          }  
          for(var i = 0; i < data.email_addresses.length; i++) {
            this.person.emailAddresses[i] = {value: data.email_addresses[i].email_address}
          }

          if(data.phone_numbers.length > 0) {
            this.phoneNumbers = []
          }  
          for(var i = 0; i < data.phone_numbers.length; i++) {
            this.person.phoneNumbers[i] = {value: data.phone_numbers[i].phone_number}
          }
          this.currentPersonId = data.id
          this.$refs.addPersonModal.show()
        }
      },
      onFilterSet (filterText) {
        this.moreParams = {
            'filter': filterText
        }
        Vue.nextTick( () => this.$refs.vuetable.refresh())
      },
      onFilterReset () {
        this.moreParams = {}
        Vue.nextTick( () => this.$refs.vuetable.refresh())

      },
      loadAddresses(addressArray) {
        var addressHtml = ''
        for(var i = 0; i < addressArray.length; i++) {
          addressHtml += `
            ${addressArray[i]['street1']}
            ${i === addressArray.length - 1 ? '<br>' : '<hr>'}
          `
        }
        return addressHtml
      },
      loadList(dataArray, key) {
        var dataHtml = ''
        for(var i = 0; i < dataArray.length; i++) {
          dataHtml += `
            ${dataArray[i][key]} 
            ${i === dataArray.length - 1 ? '<br>' : '<hr>'}
          `
        }
        return dataHtml
      },
      renderVuetable(h) {
        return h(
          'vuetable', 
          { 
            ref: 'vuetable',
            props: {
              apiUrl: this.apiUrl,
              fields: this.fields,
              paginationPath: "",
              perPage: 10,
              multiSort: true,
              sortOrder: this.sortOrder,
              appendParams: this.appendParams,
              detailRowComponent: this.detailRowComponent,
              css: this.css.table,
            },
            on: {
              'vuetable:cell-clicked': this.onCellClicked,
              'vuetable:pagination-data': this.onPaginationData,
            },
            scopedSlots: this.$vnode.data.scopedSlots
          }
        )
      },
      addAddressInput: function (inputType) {
        if(inputType === 'address') {
          this.person.addresses.push({value: '', fromGoogle: true})
        }else if(inputType === 'email') {
          this.person.emailAddresses.push({value: ''})
        }else {
          this.person.phoneNumbers.push({value: ''})
        }
      },
      removeAddressInput: function (inputType) {
        if(inputType === 'address') {
          this.person.addresses.pop()
        } else if(inputType === 'email') {
          this.person.emailAddresses.pop()
        } else {
          this.person.phoneNumbers.pop()
        }
      },
      getAddressData: function (addressData, placeResultData, id) {
        var addressIndex = id.split("-")[1]
        this.person.addresses[addressIndex] = addressData
      },
      addNewPerson: function() {
        this.$http.post('http://localhost:8000/api/v1.0/people/', this.formatPerson()).then(response => {
          this.$refs.addPersonModal.hide()
          this.$refs.vuetable.reload()
        });
      },
      updatePerson: function() {
        this.$http.put(`http://localhost:8000/api/v1.0/people/${this.currentPersonId}/?format=api`, this.formatPerson()).then(response => {
          this.$refs.addPersonModal.hide()
          this.$refs.vuetable.reload()
        });
      },
      formatPerson: function() {
        return {
          'first_name': this.person.firstName,
          'last_name': this.person.lastName,
          'date_of_birth': this.person.dateOfBirth,
          'addresses': this.person.addresses,
          'phone_numbers': this.person.phoneNumbers,
          'email_addresses': this.person.emailAddresses
        }
      },
      renderPagination(h) {
        return h(
          'div',
          { class: {'vuetable-pagination': true} },
          [
            h('vuetable-pagination-info', { ref: 'paginationInfo', props: { css: this.css.paginationInfo } }),
            h('vuetable-pagination', {
              ref: 'pagination',
              props: { css: this.css.pagination },
              on: {
                'vuetable-pagination:change-page': this.onChangePage
              }
            })
          ]
        )
      }
    }
  }
</script>