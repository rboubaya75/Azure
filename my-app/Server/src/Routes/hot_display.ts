import * as express from "express" 
import * as mongoose from "mongoose"

/* Create a new mongoose Schema for a meme document*/

const memeSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true, index: { unique: true } },
    url: { type: String, required: true }
})

/* Create a mongoose model that connects the Schema with the collection */
const collection = "_memes"
const Meme = mongoose.model(collection, memeSchema)


let All_memes 

/* Define the route */
export default async function getMemes(req, res) {

    await Meme.find((err, res) => {
        All_memes = res
    })

    res.send(All_memes)
}