
const fs = require('fs');

/* Configure Angular `environment.ts` file path */
const envPath = './src/environments/environment.ts';

/* read secret property list as input */
var secretPropertyArgs = process.argv.slice(2);

/* create a dictionary of overidden property:value */
var overiddenProperties = {};

/* if empty list then ignore */
if (secretPropertyArgs.length > 0) {
    /* get env object from path if path exists*/
    if (fs.existsSync(envPath)) {
        let envTxt = fs.readFileSync(envPath,{ encoding: 'utf8'});
        const plainJsonRegex = /\{([^}]+)\}/g;  /* TODO! Better Regex for Complex Jsons */
        const matches = envTxt.match(plainJsonRegex);

        /* convert env json to js object */
        if (matches.length > 0) {
            try {
                envObject = JSON.parse(matches[0]);
                console.log(envObject);
                /* add all existing env values */
                for (let property in envObject) {
                    overiddenProperties[property] = envObject[property];
                }
                console.log(overiddenProperties);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    /* overwrite or add secretProperty using process.env */
    for (let secretProperty of secretPropertyArgs) {
        /* add property if it didnt exist in env */
        /* overwrite current value if process.env is not undefined or null */
        if (!overiddenProperties.hasOwnProperty(secretProperty) ||
            (process.env[secretProperty] !== undefined && process.env[secretProperty] !== null)
        ) {
            overiddenProperties[secretProperty] = process.env[secretProperty];
        }
    }

    console.log(overiddenProperties);

    /* create `environment.ts` file structure */
    let envConfigProperties = [];
    for(let property in overiddenProperties){
        envConfigProperties.push(`"${property}":"${overiddenProperties[property]}"`);
    }

    console.log(envConfigProperties);

    const envConfigFile = `export const environment = {\n${envConfigProperties.join(',\n')}\n};`;

    /* write environment.ts file */
    fs.writeFileSync(envPath,envConfigFile);
    
}


