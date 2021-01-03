//WebApp things
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Google Sheets API'S requires
const { google } = require("googleapis");
const keys = require("./keys.json");
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);
var num = undefined;

//Cria um objeto
function obj(name, turma) {
  return [name, turma];
}
// GET=> Mostra os dados da Planilha
app.get("/api/alunos/", (req, res) => {
  async function getData(cl) {
    const gsapi = google.sheets({ version: "v4", auth: cl });
    const opt = {
      spreadsheetId: "1D1yJI1pYQzs9ZummvcpOtFpVLopb8DSeKUAKK1pdK2w",
      range: "A2:B",
    };
    let dat = await gsapi.spreadsheets.values.get(opt);
    // dat = data
    let dataArray = dat.data.values;

    dataArray = dataArray.map((r) => {
      while (r.length < 2) {
        r.push();
      }
      return r;
    });

    var objData = [];

    dataArray.forEach((r) => {
      var id = dataArray.indexOf(r);
      objData.push({ nome: r[0], turma: r[1], id: id });
    });
    console.log(objData);
    num = objData.length;
    res.json(objData);
  }

  client.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Connected!!");
      getData(client);
    }
  });
});

// POST /api/plantas => Cria um novo aluno
app.post("/api/alunos/", (req, res) => {
  async function postAsw(cl) {
    var aswf = [];
    var row = num + 2;
    aswf.push(obj(req.body.answer1, req.body.answer2));
    const gsapi = google.sheets({ version: "v4", auth: cl });
    const updateOpt = {
      spreadsheetId: "1D1yJI1pYQzs9ZummvcpOtFpVLopb8DSeKUAKK1pdK2w",
      range: `A${row}:B${row}`, //Onde Adicionar
      valueInputOption: "USER_ENTERED", //"Metodo de escrita na planilha"
      resource: { values: aswf }, //O que adicionar
    };

    let res = await gsapi.spreadsheets.values.update(updateOpt);
    console.log(res);
  }

  client.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Connected!!");
      postAsw(client);
    }
  });
});

app.listen(port);
