import { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body.files)

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
