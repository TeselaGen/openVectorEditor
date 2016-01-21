// var addAnnotations = require('../../app/actions/addAnnotations');
// var expect = require('chai').expect;
// var state = require('../testHelpers/baobabTeststate.js');

// describe('addAnnotations', function() {
//     it('adds features to sequence object', function() {
//         var newFeatures = [{
//             name: 'hey',
//             start: 1,
//             end: 3
//         }];
//         const mockedInput = {
//             annotationType: 'features',
//             annotationsToInsert: newFeatures,
//             throwErrors
//         };
//         const mockedState = {
//             sequenceData: {
//                 get: function (argument) {
//                     return
//                 }
//             }
//         };
//         const mockedOutput = {};
//         const mockedServices = {};
//         addAnnotations({}, mockedState, mockedOutput, mockedServices);
//         //clear the selectionLayer
//         addAnnotations('features', newFeatures);
//         expect(state.get('sequenceData', 'features')).to.exist;
//         expect(state.get('sequenceData', 'features')).to.deep.equal(newFeatures);
//     });
//     it('adds parts to sequence object', function() {
//         //clear the selectionLayer
//         var newParts = [{
//             name: 'hey',
//             start: 1,
//             end: 3
//         }];
//         addAnnotations('parts', newParts);
//         expect(state.get('sequenceData', 'parts')).to.exist;
//         expect(state.get('sequenceData', 'parts')).to.deep.equal(newParts);
//     });
//     //tnrtodo: add more tests to make sure other cases are working
// });