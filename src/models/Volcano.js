import { Schema, model, Types} from "mongoose";

const volcanoSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minLength: [2, "Name must be at least 2 characters!"]
    },
    location : {
        type: String,
        required: [true, "Location is required!"],
        minLength: [3, "Location must be at least 3 characters!"]
    },
    elevation : {
        type: String,
        required: [true, "Elevation is required!"],
        min: [0, "Elevation must be minimum 0!"]
    },
    lastEruption: {
        type: String,
        required: [true, "Last eruption is required!"],
        min: [0, "Last eruption must be minimum 0!"],
        max: [2024, "Last erosion must be maximum 2024!"]
    },
    image: {
        type: String,
        required: [true, "Image is required!"],
        validate: [/^https?:\/\//, "The image url must start with http:// or https://!"]
    },
    typeVolcano: {
        type: String,
        required: [true, "Type volcano is required!"],
        enum: ["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"],
    },
    description: {
        type: String,
        required: [true, "Description  is required!"],
        minLength: [10, "Description must be at least 10 characters!"]
    },
    owner: {
        type: Types.ObjectId,
        ref: "User",
    },
    voteList: [{
        type: Types.ObjectId,
        ref: "User",
    }]
});

const Volcano = model("Volcano", volcanoSchema);

export default Volcano;