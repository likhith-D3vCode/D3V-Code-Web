const factsmodel=require("../models/factsSchema");
const client=require('../redis/client')
const handleFacts=async(req,res)=>{
       const {facts}=req.body;
try{
    const response=await factsmodel.create({
        facts
      });
      return res.status(200).json({msg:"success"});
}catch(err){
    console.log("error in creating db",err)
    return res.status(401).json({msg:"failed to create mb"});
}
       
      
}


const getHandleFacts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const cacheKey = `facts_page_${page}_limit_${limit}`;

    try {
        // Check if data is cached
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // Fetch from database if not cached
        const allFacts = await factsmodel.find({}).skip(skip).limit(limit);
        const totalItems = await factsmodel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        // Store fetched data in Redis for 5 minutes
        await client.setex(cacheKey, 300, JSON.stringify({ page, limit, totalItems, totalPages, data: allFacts }));

        return res.json({ page, limit, totalItems, totalPages, data: allFacts });

    } catch (err) {
        console.error("Error fetching data from DB:", err);
        return res.status(500).json({ msg: "Failed to fetch data" });
    }
};


module.exports={handleFacts,getHandleFacts}
