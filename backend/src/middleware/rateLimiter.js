import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
    try {
        // if this was in production I would change this to IP address or user Ud, but for now i will keep it constant
        const { success } = await ratelimit.limit("my-rate-limit")

        if(!success) {
            return res.status(429).json({message: "Too many requests, please try again later."})
        }
        
        next()

    } catch (error) {
        console.log("Rate limit error")
        next(error)
    }
}

export default rateLimiter;
