import bsonObjectid from "bson-objectid";
//helper function to make sure any arrays coming in
//get converted to objects with unique ids
export default function arrayToObjWithIds(array) {
  let newObj = {};
  array.forEach(function(item) {
    let newItem = {
      ...item,
      id: item.id || bsonObjectid().str
    };
    newObj[newItem.id] = newItem;
  });

  return newObj;
}
