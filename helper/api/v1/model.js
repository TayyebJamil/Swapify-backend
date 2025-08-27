module.exports = {
  id: async (model, _id) => await model.find({ _id }),
  condition: async (model, condition) => await model.find(condition)
}
