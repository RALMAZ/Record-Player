export const selector = {
  methods: {
    selector(id) {
      return id ? document.getElementById(id) : false
    }
  }
}
