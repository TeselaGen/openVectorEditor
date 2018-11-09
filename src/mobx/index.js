import { types, getSnapshot } from "mobx-state-tree";
import {keyBy} from "lodash";

const RangeType = types.model("RangeType", {
  start: -1,
  end: -1
});

const AnnotationType = types.compose(
  types.model("AnnotationType", {
    id: types.identifier
  }),
  RangeType
);

const SelectionLayer = types.optional(
  types.compose(
    "SelectionLayer",
    RangeType,
    types.model({
      color: "blue"
    })
  ), {}
);

const EditorType = types
  // 1
  .model("EditorType", {
    sequenceData: types
      .model("SequenceData", {
        sequence: "",
        // _features: types.map(AnnotationType),
        _features: types.map(AnnotationType),
        // _parts: types.map(AnnotationType)
        features: types.array(AnnotationType),
        parts: types.array(AnnotationType),
      }),
      
    //   .postProcessSnapshot(snapshot => ({
    //     // auto convert strings to booleans as part of preprocessing
    //     features: console.log('snapshot:',snapshot) || snapshot.features.toJS(),
    //     parts: snapshot.parts.toJS(),
    // })),
      
      // .views(self => {
      //   console.log('features', self._features)
      //   return {
      //     set features(features) {
      //       console.log('1 2 features', features)
      //       self._features = Array.isArray(features) ? keyBy("id", features ) : features
      //     },
      //     get features() {
      //       return self._features.toJSON();
      //     },
      //     get parts() {
      //       return self._parts.toJSON();
      //     },
      //     get sequenceLength() {
      //       return self.sequence.length;
      //     }
      //   };
      // }).views(self => {}),
    readOnly: false, // 2
    selectionLayer: SelectionLayer,
    caretPosition: -1,
    restrictionEnzymes: types.array(
      types.model({
        name: types.string,
        site: types.string,
        forwardRegex: types.string,
        reverseRegex: types.string,
        topSnipOffset: types.integer,
        bottomSnipOffset: types.integer
      })
    )
  })
  // .views(self => {
  //   // return {
  //   //   // 6
  //   //   get completedTodos() {
  //   //     return self.todos.filter(t => t.done);
  //   //   },
  //   //   // 7
  //   //   findTodosByUser(user) {
  //   //     return self.todos.filter(t => t.assignee === user);
  //   //   }
  //   // };
  // })
  .actions(self => {
    return {
      updateSelectionLayer(newSelectionLayer) {
        self.selectionLayer = {
          ...self.selectionLayer,
          ...newSelectionLayer
        };
        console.log("self.selectionLayer:", self.selectionLayer);
      },

      updateSequenceData(newSequenceData) {
        self.sequenceData = {
          ...newSequenceData
        };
      }
    };
  });

// // listen to new snapshots
// onSnapshot(store, snapshot => {
//   console.dir(snapshot);
// });

// // invoke action that modifies the tree
// store.todos[0].toggle();
// // prints: `{ todos: [{ title: "Get coffee", done: true }]}`

export default EditorType;

// import { computed, observable } from "mobx";

// class Editor {
//   id = "exampleEditor";
//   @observable
//   sequenceData = new SequenceData();
//   @observable
//   selectionLayer = new SelectionLayer();
//   @computed
//   get sequenceLength() {
//     return this.sequenceData.sequence.length;
//   }
// }
// class SequenceData {
//   @observable
//   sequence = "";
//   @observable
//   features = observable.map();
// }
// class Range {
//   @observable
//   start = -1;
//   @observable
//   end = -1;
// }
// class SelectionLayer extends Range {
//   @computed
//   get selectionLength() {
//     console.log('this.end:',this.end)
//     return this.end - this.start
//   }
// }

// class Annotation extends Range {
//   id = Math.random();
//   name = "Untitled";
// }

// export default Editor
