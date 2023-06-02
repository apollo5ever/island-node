function hex2a(hex){
    if(!hex) return
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;

    
}

module.exports = hex2a