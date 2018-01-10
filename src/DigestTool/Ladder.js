import React from "react";
import Select from "react-select";

// import {List, DropDownMenu} from 'material-ui';

export default class Ladder extends React.Component {
  // handleChange = (event, index, value) => {
  //     let geneRuler;
  //     if (value.text === 'GeneRuler 100bp + DNA') {
  //         geneRuler = "geneRuler100bp";
  //     } else {
  //         geneRuler = "geneRuler1kb";
  //     }
  //     this.setState({ geneRuler });
  //     this.props.signals.createFragmentsLines({ geneRuler, enzymes: this.props.gelDigestEnzymes });
  // };

  render() {
    let { gelDigestEnzymes = [], fragments = [], fragmentsNum } = this.props;

    let menuItems = [
      { value: "1", label: "GeneRuler 1kb + DNA" },
      { value: "2", label: "GeneRuler 100bp + DNA" }
    ];

    let fragmentsCount;
    let pluralFragments = "fragments";
    let pluralEnzymes = "enzymes";
    if (gelDigestEnzymes.length === 0) {
      fragmentsCount = (
        <div className={"ve-fragmentsNumLabel"}>No digestion</div>
      );
    } else {
      if (fragmentsNum === 1) {
        pluralFragments = "fragment";
      }
      if (gelDigestEnzymes.length === 1) {
        pluralEnzymes = "enzyme";
      }
      fragmentsCount = (
        <div className={"ve-fragmentsNumLabel"}>
          <div style={{ float: "left" }}>
            {fragmentsNum} {pluralFragments}
          </div>
          <div style={{ float: "right" }}>
            {gelDigestEnzymes.length} {pluralEnzymes}
          </div>
        </div>
      );
    }

    return (
      <div>
        <Select
          onChange={this.handleChange}
          options={menuItems}
          style={{ backgroundColor: "#E0E0E0", zIndex: "20", width: "100%" }}
          underlineStyle={{ opacity: 0 }}
          iconStyle={{ fill: "black" }}
          labelStyle={{ fontSize: 15, color: "black", lineHeight: "48px" }}
        />

        {fragmentsCount}

        <ul className={"ve-managerListLadder"}>
          {fragments.map((fragment, index) => (
            <div
              className={"ve-tooltip"}
              key={index}
              style={{
                bottom: fragment.bottom,
                left: fragment.left,
                width: fragment.width
              }}
            >
              <span className={"ve-tooltiptext"}>{fragment.tooltip}</span>
              <hr
                style={{ margin: "0" }}
                className={fragment.align === "left" ? "ve-left" : "ve-right"}
              />
            </div>
          ))}
        </ul>
      </div>
    );
  }
}
