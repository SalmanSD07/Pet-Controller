async function getStreams(categoryData) {
    const data = await categoryData.aggregate([
      {
        $group: {
          _id: "$category_id",
          menuList: {
            $push: {
                num:"$num",
                name: "$name",
                stream_type: "$stream_type",
                stream_id:"$stream_id"
            },
          },
        },
      },
    ]);
    return data[0] ? data : false;
  }


  module.exports={getStreams}