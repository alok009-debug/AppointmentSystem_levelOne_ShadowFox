const serverHealth = (req,res)=>{

    res.status(200).json({
        message:"sever working prefectly"
    })
}


module.exports=serverHealth;