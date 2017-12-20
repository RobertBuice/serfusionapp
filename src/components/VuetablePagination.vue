<template>
  <ul class="pagination">
    <li :class="{'disabled': isOnFirstPage}">
      <a href="" @click.prevent="loadPage('prev')">
        <span>&laquo;</span>
      </a>
    </li>
    
    <template v-if="notEnoughPages">
      <li v-for="n in totalPage" :class="{'active': isCurrentPage(n), 'cursor-pointer': true, 'page-item': true}">
        <a @click.prevent="loadPage(n)" v-html="n" :class="{'page-link': true}"></a>
      </li>
    </template>
    <template v-else>
      <li v-for="n in windowSize" :class="{'active': isCurrentPage(windowStart+n-1), 'cursor-pointer': true, 'page-item': true}">
        <a @click.prevent="loadPage(windowStart+n-1)" v-html="windowStart+n-1" :class="{'page-link': true}"></a>
      </li>
    </template>

    <li :class="{'disabled': isOnLastPage}">
      <a href="" @click.prevent="loadPage('next')">
        <span>&raquo;</span>
      </a>
    </li>
  </ul>
</template>

<script>
import VuetablePaginationMixin from 'vuetable-2/src/components/VuetablePaginationMixin'
export default {
  mixins: [VuetablePaginationMixin]
}
</script>