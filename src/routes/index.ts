import express, { Router } from "express";
import partnerRoute from "./partnerRoute";
import productRoute from "./productRoute";

const router = express.Router();

export default (): express.Router => {
    partnerRoute(router);
    productRoute(router);
    return router;
}