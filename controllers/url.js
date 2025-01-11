const shortid = require("shortid");

const URL = require("../models/url")

async function handleCreateNewURL(req, res) {
    const body = req.body;
    if(!body.url){
        return res.status(400).json({error:"URL is required"});
    }

    const shortId = shortid(); // returns the short id of length 8
    await URL.create({
        shortUrl: shortId,
        redirectedUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    return res.render("home",{
        url_id:shortId,
    });
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortUrl;

    const result = await URL.findOne({shortUrl: shortId});

    return res.json({"Total Visits":result.visitHistory.length,
        "Analytics": result.visitHistory,
    });
}

module.exports = {
    handleCreateNewURL,
    handleGetAnalytics,
};