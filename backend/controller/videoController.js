const path = require('path');

exports.getVideo = async (req, res, next) => {
    console.log('getVideo request with ' + req.params.roomid + ' ' + req.params.filename);
    const fileName = req.params.filename;
    //console.log(path.join(__dirname, '../storage/hls/'+req.params.roomid+'/'+req.params.filename));
    res.sendFile(fileName, { root: path.join(__dirname, '../storage/hls/'+req.params.roomid) });
};