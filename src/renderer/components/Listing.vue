<template>
    
</template>

<script>
  export default {
    name: 'Listing',
    props: {
      some: {
        type: String | Object,

        required: true,

        // if required false, can default
        default: () => {},

        validator: value => value
      }
    },
  }
</script>

