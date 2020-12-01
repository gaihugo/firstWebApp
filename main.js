const { google } = require("googleapis");
const keys = require("./keys.json");
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Connected!!");
    gsrun(client);
  }
});

async function gsrun(cl) {
  const gsapi = google.sheets({ version: "v4", auth: cl });
  const opt = {
    spreadsheetId: "1D1yJI1pYQzs9ZummvcpOtFpVLopb8DSeKUAKK1pdK2w",
    range: "A2:B5",
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

  let mapDat = dataArray.map((r) => {
    r.push(r[0] + "-" + r[1]);
    return r;
  });
  //console.log(mapDat);

  const updateOpt = {
    spreadsheetId: "1D1yJI1pYQzs9ZummvcpOtFpVLopb8DSeKUAKK1pdK2w",
    range: "E2",
    valueInputOption: "USER_ENTERED",
    resource: { values: mapDat },
  };

  let res = await gsapi.spreadsheets.values.update(updateOpt);
  console.log(res);
}
