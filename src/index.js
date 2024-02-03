const app = require("./app");
const PORT = 5000



const startApp = () =>{
    app.listen(PORT, () => {
        console.log(`Auth Backend Running on Port ${PORT}`);
        console.log("Backend JS Running Successfully")
    })

}

startApp()