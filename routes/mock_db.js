exports.getPayloadByKey = (key, callback) => {
    var payload = {
        key: 'xp2y',
        question: 'สไปเดอร์แมนคีบแขนทศกัณฑ์',
        answer: '8220',
        image: './mockupimg.jpg',
        status: false
    }
    callback(false, payload);
};

exports.updateStatusByKey = (key, callback) => {
    //Change Status to true
    callback(false);
};