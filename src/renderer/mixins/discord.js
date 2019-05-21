const DiscordRPC = require('discord-rpc');

export const discord = {
  data() {
    return {
      discord: true,
      clientId: '499605504813826053',
      rpc: {}
    }
  },

  create() {
    DiscordRPC.register(this.clientId);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });
  },

  mounted() {
    this.setActivity('Search song', 'Radio Record', new Date());

    var clientIdLocal = this.clientId;
    this.rpc.login({ clientIdLocal }).catch(()=> {
      this.discord = false;
    });
  },

  methods: {
    setActivity(details, state, time) {
      this.rpc.setActivity({
        details: details,
        state: state,
        startTimestamp: time,
        largeImageKey: 'record',
        largeImageText: title,
        instance: false
      });
    }
  }
}