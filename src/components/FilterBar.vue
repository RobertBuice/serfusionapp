<template>
  <b-col lg="6" class="mb-3" style="padding-left:0">
    <b-input-group>
      <b-form-input type="text" v-model="filterText" @keyup.enter="doFilter" placeholder="Filter table by any field" />
      <b-input-group-button>
        <b-button variant="success" @click="doFilter">Apply Filter</b-button>
        <b-button variant="info" @click="resetFilter">Reset</b-button>
      </b-input-group-button>
    </b-input-group>
  </b-col>
</template>

<script>
  export default {
    data () {
      return {
        filterText: ''
      }
    },
    methods: {
      doFilter () {
        this.$events.fire('filter-set', this.filterText)
      },
      resetFilter () {
        this.filterText = ''
        this.$events.fire('filter-reset')
      }
    }
  }
</script>