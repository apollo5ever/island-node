const fetch = require('node-fetch-commonjs');
const AddIsland=require('./addIsland')
const AddBounty = require('./addBounty');
const AddFundraiser = require('./addFundraiser');


function hex2a(hex){
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;

    
}


  
  async function store(cid,island,type,index){
  const response = await fetch(`http://127.0.0.1:5001/api/v0/cat?arg=${cid}`,{
      method: 'POST'
  
  })
  
  const data = await response.json()
  console.log("data",data)
  if(type=="bounty"){
    AddBounty(data,island,index)
  }
  else if(type=="fundraiser"){
    AddFundraiser(data,island,index)
  }
  else{
    AddIsland(data)
  }

  }


  
  
module.exports = store
 