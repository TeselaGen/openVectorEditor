import React from "react";

export default class GuideTool extends React.Component {
  render() {
    const { activeRegion = {} } = this.props.guideToolProps || {};
    // const {} = this.props
    return (
      <div>
        Start: {activeRegion.start || 1}
        End: {activeRegion.end || 1}
        I'm the guide tool row{" "}
        <button
          onClick={() => {
            this.props.updateGuides([
              Math.random > 0.5
                ? { name: "new guide", id: "newGuide", start: 20, end: 40 }
                : { name: "old guide", id: "oldGuide", start: 60, end: 80 }
            ]);
          }}
        >
          I'm a guide
        </button>
      </div>
    );
  }
}
