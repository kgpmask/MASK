const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    name : {type : String, require : true},
    link : {type : String},
    type : {type : String, require : true},
    attr : {type : Array},
    date : {type : String, require : true},
    show : String,
    page : String,
    hype : Boolean
});

postSchema.set("collection",'posts');

postModel = mongoose.model("posts",postSchema);

function getArt(){
    return postModel.find({type : "art"})
};

function getLetter(){
    return postModel.find({type : "letter"})
};

function generateEmbedTag(link){
    var linkId = link.slice(link.indexOf("v=")+2)
    const embedTag = "<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/"+linkId+"\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"
    return embedTag
};

function getVids(){
    return postModel.find({type : "video"})
};