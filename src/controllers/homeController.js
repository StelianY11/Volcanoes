import { Router } from "express";

const homeController = Router();

homeController.get('/', (req, res) => {
    res.render('home', { title: "Home Page" });
});

//Test for authorization
homeController.get("/authorized", (req, res) => {
    res.send(req.user);
});


export default homeController;