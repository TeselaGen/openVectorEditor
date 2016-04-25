// function mixin(target, source) {
//     target = target.prototype;

//     Object.getOwnPropertyNames(source).forEach((name) => {
//         let sourceProp = Object.getOwnPropertyDescriptor(source, name);

//         if (name !== "constructor") {
//             Object.defineProperty(target, name, sourceProp);
//         }
//     });
// }

// module.exports = mixin;
