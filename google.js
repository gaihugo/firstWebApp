//Google Sheets API'S requires
const { google } = require("googleapis");
const keys = require("./keys.json");
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

//Acessa os dados da Planilha
async function getData(cl) {

    async function checkConect() {
      client.authorize((err, tokens) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("Connected!!");
          getData(client);
        }
      });
    }

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
}


module.exports = {
  getData,
  checkConect,
};
