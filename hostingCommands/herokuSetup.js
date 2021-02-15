const {exec} = require("child_process");

const fs = require("fs");

function initialiseSetup(startingPoint = "index.js"){
    try {
        exec("pip freeze > requirements.txt", (error, data, getter) => {
            if(error){
                console.log("error",error.message);
                return;
            }
            console.log("-----> success, requirements.txt created✔️");
            process.exit(0)
        });

        const writeStream = fs.createWriteStream("Procfile");
        writeStream.write(`web: node ${startingPoint}`);
        writeStream.end();
        console.log("\n-----> success, Procfile created✔️");

    } catch (error) {
        console.log(error.message)
    }
    
}

module.exports = initialiseSetup