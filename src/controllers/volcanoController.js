import { Router } from "express";
import volcanoService from "../services/volcanoService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const volcanoController = Router();

volcanoController.get('/', async (req, res) => {
    const volcanoes = await volcanoService.getAll().lean();
    res.render('volcanoes', { volcanoes, title: "Volcanoes Page" });
});

volcanoController.get('/create', isAuth, (req, res) => {
    const volcanoData = req.body;
    const volcanoDataType = getVolcanoTypeData(volcanoData);

    res.render('volcanoes/create', { title: "Create volcanoes Page", volcanoTypes: volcanoDataType });
});

volcanoController.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const userId = req.user._id;

    try {
        await volcanoService.create(volcanoData, userId);

        res.redirect("/volcanoes");
    } catch (err) {
        const volcanoDataType = getVolcanoTypeData(volcanoData);

        res.render('volcanoes/create', { volcano: volcanoData, volcanoTypes: volcanoDataType, error: getErrorMessage(err) });
    }
});

volcanoController.get("/:volcanoId/details", async (req, res) => {
    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    const isOwner = volcano.owner.toString() === req.user?._id;

    const isVoted = volcano.voteList?.some(userId => userId == req.user?._id);
    const volcanoCount = volcano.voteList?.length || 0;

    res.render("volcanoes/details", { volcano, isVoted, isOwner, volcanoCount, title: "Volcano Details Page" });
});

volcanoController.get("/search", async (req, res) => {
    const searchFilter = req.query;
    const volcanoes = await volcanoService.getAll(searchFilter).lean();
    const volcanoTypes = getVolcanoTypeData(searchFilter);

    res.render("volcanoes/search", { volcanoes, volcanoTypes, searchFilter, title: "Volcanoes Search Page" });
});

volcanoController.get("/:volcanoId/vote", isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;

    if (isVolcanoOwner(volcanoId, userId)) {
        return res.redirect(`/404`)
    }

    try {
        await volcanoService.vote(volcanoId, userId);

        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (err) {
        console.log(err.message);

    }
});

volcanoController.get("/:volcanoId/edit", isAuth, async (req, res) => {
    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    const volcanoType = getVolcanoTypeData(volcano);
    const isOwner = volcano.owner.toString() === req.user._id;

    if (!isOwner) {
        return res.redirect("/404")
    }

    res.render("volcanoes/edit", { volcano, volcanoType, title: "Volcano Details Page" });
});

volcanoController.post("/:volcanoId/edit", isAuth, async (req, res) => {
    const volcanoData = req.body;
    const volcanoId = req.params.volcanoId;

    if (!isVolcanoOwner(volcanoId, req.user._id)) {
        return res.redirect("/404")
    }

    try {
        await volcanoService.edit(volcanoId, volcanoData);

        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (err) {
        const volcanoType = getVolcanoTypeData(volcanoData);

        res.render("volcanoes/edit", { volcano: volcanoData, volcanoType, error: getErrorMessage(err), title: "Volcano Details Page" });
    }
});

volcanoController.get("/:volcanoId/delete", isAuth, async (req, res) => {
    if (!isVolcanoOwner(req.params.volcanoId, req.user._id)) {
        return res.redirect("/404")
    }

    try {
        console.log(req.params.volcanoId);

        await volcanoService.remove(req.params.volcanoId);

        res.redirect("/volcanoes")
    } catch (err) {
        console.log(err.message);
    }
});


function getVolcanoTypeData({ typeVolcano }) {
    const volcanoType = [
        'Supervolcanoes',
        'Submarine',
        'Subglacial',
        'Mud',
        'Stratovolcanoes',
        'Shield',
    ];

    const viewData = volcanoType.map(type => ({
        value: type,
        label: type,
        selected: typeVolcano === type ? "selected" : ""
    }));

    return viewData;
};

async function isVolcanoOwner(volcanoId, userId) {
    const volcano = await volcanoService.getOne(volcanoId);
    const isOwner = volcano.owner.toString() === userId;

    return isOwner;
}

export default volcanoController;