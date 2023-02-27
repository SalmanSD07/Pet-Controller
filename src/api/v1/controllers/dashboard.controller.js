const {success,badRequest,onError,serverValidation,notFound}=require('../helpers/response_helper')
const {validationResult}=require('express-validator')

const {parseJwt}=require('../middleware/isAuthenticated')
const {getStreams}=require('../helpers/dashboard_helper')

const axios=require('axios')

module.exports={
    recentlyAddedPet:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{errorName:"serverValidation",errors:errors.array()})

            }else{
                // const token=req.headers.authorization
                // const tokenData=parseJwt(token)
                // const userId=tokenData.user_id
                const limitValue=10
                const page=req.query.page|| 1
                recentMovies=[]
                const config={
                    method:'GET',
                    url:`http://88.99.244.62:80/player_api.php?username=sakshi&password=sakshi2022&action=get_vod_streams`
                }
                const list=await axios(config)
                console.log(list.data)
                if(list.data.length>0){
                    const allPets=list.data
                    const rp=allPets.sort(function(a,b){
                        return (a.name.split(" ").slice(-1)[0].slice(1,5))-(b.name.split(" ").slice(-1)[0].slice(1,5))
                    }).reverse()
                    if(rp.length>0){
                        var pages=0
                        var pageCount=Math.floor(rp.length/10)
                        if(pageCount<(rp.length/10)){
                            pages=pageCount+1
                        }else{
                            pages=pageCount
                        }
                        var initialResult=rp.slice((page-1)*(limitValue),page*limitValue)
                        initialResult?success(res,'heres all you need',initialResult): badRequest(res,'cannot get desired result')
                    }else{
                        notFound(res,'nothing to show')
                    }
                }else{
                    notFound(res,'cannot find your searched list')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'error has just occured',error)
        }
    },
    getCategory:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation has just occured",errors:errors.array()})
            }else{
                let uri=""
                const type=req.params.type
                if(type=='movies'){
                    uri=`http://88.99.244.62:80/player_api.php?username=sakshi&password=sakshi2022&action=get_vod_categories`
                }else if(type=='series'){
                    uri=`http://88.99.244.62:80/player_api.php?username=sakshi&password=sakshi2022&action=get_series_categories`
                }else if(type=='live'){
                    uri=`http://88.99.244.62:80/player_api.php?username=sakshi&password=sakshi2022&action=get_live_categories`
                }
                const config={
                    method:'GET',
                    url:uri
                }
                const responseData=await axios(config)
                if(responseData.data.length>0){
                    success(res,'heres the categories',responseData.data)
                }else{
                    notFound(res,'nothing could be found in this category')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    petsByCategory:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{message:"server validation has just occured","errors":errors.array()})
            }else{
                const config={
                    method:'GET',
                    url:`http://88.99.244.62:80/player_api.php?username=sakshi&password=sakshi2022&action=get_vod_streams`
                }
                const response=await axios(config)
                if(response.data.length>0){
                    const rp=await getStreams(response.data)
                    success(res,'heres the databy category',rp)
                }else{
                    notFound(res,'no streams has been found to show')
                }

            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    }
}