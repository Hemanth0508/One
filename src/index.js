const express = require("express");
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");
const multer = require('multer');
const xml2js = require('xml2js');

const app = express();
const templatePath = path.join(__dirname, '../templates');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "hbs");
app.set("views", templatePath);


app.get("/", (req, res) => {
    res.render("home");
});


app.post("/enter", upload.single('xmlFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }


    xml2js.parseString(req.file.buffer.toString(), async (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return res.status(400).send('Invalid XML format');
        }

        
        console.log('Parsed XML:', JSON.stringify(result, null, 2));

        
        const persons = result.people.person.map(person => ({
            name: person.name[0], 
            phone: person.phone[0] ,
            email: person.email[0] ,
            address : person.address[0],
            age: person.age[0],
            gender: person.gender[0]
        }));

        try {
            
            await collection.insertMany( persons);
            res.send('XML data successfully saved to the database');
        } catch (error) {
            console.error('Error inserting data into the database:', error);
            res.status(500).send('An error occurred while saving to the database');
        }
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
