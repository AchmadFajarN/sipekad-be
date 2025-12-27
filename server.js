import app from "./src/app.js";
import dns from "node:dns"
dns.setDefaultResultOrder('ipv4first');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => [
    console.log("Server are runing at port", PORT)
])