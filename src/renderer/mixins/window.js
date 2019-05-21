const remote = require('electron').remote;

export const window = {
  methods: {
    close() {
      remote.getCurrentWindow().close();
    },
    
    min() {
      remote.getCurrentWindow().minimize();
    }
  }
}