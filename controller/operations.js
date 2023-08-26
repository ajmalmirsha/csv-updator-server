


module.exports = {
    addToDataBase : async (Schema,data) => {
       const response = await Schema.create(data)
       return response._id
    }
}