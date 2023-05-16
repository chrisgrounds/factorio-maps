import { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const file = req.body.forEach((x, y) => { console.log(x, y) });
  // const base64File = Buffer.from(file).toString('base64');
  // console.log(req)

  const fileData = [];

  // console.log(req.body)

  // const data = await new Promise((resolve, reject) => {
  //   const form = formidable({ multiples: true });

  //   form.parse(req, (err, fields, files) => {
  //     if (err) reject({ err })
  //     // console.log(files.file[0]) // NOT EMPTY



  //     // const b64 = Buffer.from(pair[1]).toString('base64');
  //     // fileData.push({ filename: pair[0].name, data: b64 })


  //     resolve({ err, fields, files })
  //   })
  // })

  // console.log(fileData)

  // const response = await fetch('https://your-api-url/maps', {
  //   method: 'POST',
  //   body: JSON.stringify({ file: base64File }),
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // const responseBody = await response.json();
  const responseBody = {
    "link": "shsd6d6v-sd878v-vdfvdf-vdfvxa-dfvdfv"
  }
  res.status(200).json(responseBody);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    }
  }
}