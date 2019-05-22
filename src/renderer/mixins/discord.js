const DiscordRPC = require('discord-rpc');
const clientId = '499605504813826053';
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

export const discord = {
  data() {
    return {
      discord: true
    }
  },

  created() {
    rpc.login({ clientId }).catch(()=> {
      this.discord = false;
    });
  },

  methods: {
    setActivity(
      details,
      stateTest,
      time,
      channel
    ) {
      if (
        this.discord
        &&
        details != ''
        &&
        stateTest != ''
        &&
        time
        &&
        channel != ''
      ) {
        rpc.setActivity({
          details: details,
          state: stateTest,
          startTimestamp: time,
          largeImageKey: 'record',
          largeImageText: channel,
          instance: false
        });
      }
    }
  }
}