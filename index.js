let express = require('express');
let app = express();
let bodyParse = require('body-parser');
let mysql = require('mysql');

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

//homepage route
app.get('/', (req, res) => {
  return res.send({
    error: false,
    message: 'Welcome API EEG, MySQL',
    written_by: 'Brainspoke',
  })
})

// Connection to mysql database
let dbCon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'P@ssw0rd',
  database: 'eeg_api'
})

dbCon.connect();

// Retrieve all EEG
app.get('/eeg', (req, res) => {
  dbCon.query('SELECT * FROM eeg', (error, results, fields) => {
    if (error) throw error;

    let message =""
    if (results === undefined || results.length ==0) {
      message = "EEG Table is empty";
    } else {
      message = "Successfully retrieved all EEG";
    }
      return res.send({error: false, data: results, message: message});
  })
})

//Add frequency
app.post('/eeg', (req, res) => {
  let frequency = req.body.frequency;
  let percentage = req.body.percentage;

  // Validation
  if (!frequency || !percentage) {
    return res.status(400).send({error: true, message: "Please provide EEG frequency and percentage. "});
  } else {
    dbCon.query('INSERT INTO eeg (frequency, percentage) VALUES(?, ?)', [frequency, percentage],  (error, results, fields) => {
      if (error) throw error;
      return res.send({error: false, data: results, message: "EEG Sueeessfuly added"})

    })
  }
});

//Retrieve EEG frequency
app.get('/eeg/:id', (req, res) => {
  let id = req.params.id;

  if (!id) {
    return res.status(400).send({error: true, message: "Please provide EEG id"});
  }else {
    dbCon.query("SELECT * FROM eeg WHERE id = ?", id, (error, results, fields) => {
      if (error) throw error;

      let message = "";
      if (results === undefined || results.length ==0){
        message = "EEH not found";
      }else {
        message = "Successfully Retrieved EEG Data"
      }

      return res.send({error: false, data: results[0], message: message})
    })
  }
})

//Update EEG with id
app.put('/eeg', (req, res) => {
  let id = req.body.id;
  let frequency = req.body.frequency;
  let percentage = req.body.percentage;

  //Validation
  if (!id || !frequency || !percentage) {
    return res.status(400).send({error: true, message: 'Please provide EEG id, frequency and percentage'});
  } else {
    dbCon.query('UPDATE eeg SET frequency =?, percentage =? WHERE id =' [frequency, percentage, id], (error, results, fields) => {
      if (error) throw error;

      let message = "";
      if (results.changedRows === 0) {
        message = "EEG not found or data are same";
      }else {
        message = "EEG Successfily Update";
      }

      return res.send({error: false, data: results, message: message})
    })
  }
})

//Delete EEG by id
app.delete('/eeg', (req, res) => {
  let id = req.body.id;

  if (!id) {
    return res.status(400).send({error: true, message: "Please Provide EEG id"});
  }else {
    dbCon.query('DELETE FROM eeg WHERE id = ?', [id], (error, results, fields) => {
      if (error) throw error;

      let message ="";
      if (results.affectedRows === 0) {
        message = "EEG not Found";
      } else {
        message = "EEG Successfuly Delete";
      }

      return res.send({error: false, data: results, message: message})
    })
  }
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
})