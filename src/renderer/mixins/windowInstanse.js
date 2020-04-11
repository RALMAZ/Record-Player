const remote = require('electron').remote

export const windowInstanse = {
  methods: {
    close() {
      remote.getCurrentWindow().close()
    },
    
    min() {
      remote.getCurrentWindow().minimize()
    }
  }
}
