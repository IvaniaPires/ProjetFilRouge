const db = require('../../config/db');




exports.perform_query = (query, values)=>{ 
   
    return new Promise((resolve, reject)=>{
    db.query(query, values,(err,result)=>{
            if(err){
                return reject(err)
            }            
            return resolve(result)
        })
       
    })   
    
}


