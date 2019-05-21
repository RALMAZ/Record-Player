const storage = require('electron-json-storage');
const os = require('os');

export const store = {
  created() {
    storage.setDataPath(os.tmpdir());
  },
  methods: {
    storageHas(key) {
      var result;
      storage.has(key, (error, hasKey) => {
        if (hasKey) {
          storage.get(key, (error2, data) => {
            result = data;
          });
        } else {
          result = false;
        }
      });

      return result;
    },

    storageSet(key, data) {
      storage.set(key, data);
    }
  }
}