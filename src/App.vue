<template>
  <div id="app">
    <div class="container">
      <div class="table-wrapper">
        <div class="table-title">
            <div class="row">
              <div class="col-sm-6">
                <h2>Serfusion | Manage your People</h2>
              </div>
              <div class="col-sm-6">
                <b-button :variant="success" v-b-modal.addPersonModal> Add Person</b-button>						
              </div>
            </div>
        </div>
        <people-table ref="peopleTable"></people-table>
      </div>
    </div>
  </div>
</template>

<script>
  import PeopleTable from './components/PeopleTable.vue'
  

  export default {
    name: 'app',
    components: {
      PeopleTable,
    },
    data: function() {
      return {
        'success': 'success',
        'link': 'link'
      }
    },
    methods: {
      
    }
  };
</script>

<style lang="scss">
  @import './assets/custom.scss'
</style>
