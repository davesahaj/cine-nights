const express = require("express");
const { getVideo } = require("../controller/videoController");
const router = express.Router();

router.route("/video/:roomid/:filename").get(getVideo);

module.exports = router;