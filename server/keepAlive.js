
const RENDER_URL =
  process.env.RENDER_URL || "https://cc-parser-backend.onrender.com";
const PING_INTERVAL = 5 * 60 * 1000;

function keepAlive() {
  fetch(RENDER_URL)
    .then((response) => {
      if (response.ok) {
        console.log(
          ` Keep-alive ping successful at ${new Date().toISOString()}`
        );
      } else {
        console.log(`  Keep-alive ping returned status ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(` Keep-alive ping failed: ${error.message}`);
    });
}

function startKeepAlive() {
  console.log(
    `🔄 Keep-alive service started. Pinging ${RENDER_URL} every ${PING_INTERVAL / 60000
    } minutes`
  );
  keepAlive();
  setInterval(keepAlive, PING_INTERVAL);
}

export default startKeepAlive;
