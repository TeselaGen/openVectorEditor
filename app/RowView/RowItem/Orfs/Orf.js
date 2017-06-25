import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class Orf extends React.Component {

    singleClick() {
        this.props.signals.orfClicked({ annotation: this.props.annotation });
    }

    doubleClick() {
        this.props.signals.orfClicked({ annotation: this.props.annotation });
        this.props.signals.sidebarToggle({ sidebar: true, annotation: this.props.annotation, view: "row" });
        // this.props.signals.adjustWidth();
    }

    handleClick(e) {
        var clicks = 0;
        var timeout;

        return function() {
            clicks += 1;

            if (clicks === 1) {
                timeout = setTimeout(function() {
                    this.singleClick();
                    clicks = 0;
                }.bind(this), 250);

            } else {
                clearTimeout(timeout);
                this.doubleClick();
                clicks = 0;
            }
        }.bind(this)
    }

    render() {
        var {
            bpsPerRow,
            height,
            rangeType,
            normalizedInternalStartCodonIndices=[],
            forward,
            annotation,
            widthInBps,
            charWidth=16,
            signals
        } = this.props;

        var frame = annotation.frame;
        // frame is one of [0,1,2]
        var color = 'red';
        if (frame === 1) {
            color = 'green';
        } else if (frame === 2) {
            color = 'blue';
        }

        var width = widthInBps * (charWidth-1) * 1.2;
        var heightWithArrow = height + 12;
        var halfwayPoint = heightWithArrow/2;
        var endCircle;
        var arrow = null;
        var arrowOffset = 0;
        var circleOffset = 0;
        var halfBpOffset = 0.5*(width/widthInBps); // centers the codon above a bp instead of in between two bps

        var circle = <circle
                        key='circle'
                        r={height*1.5}
                        cx='0'
                        cy={halfwayPoint}
                        transform={forward ?
                            `translate(${halfBpOffset},0)` :
                            `translate(${width-halfBpOffset},0)`
                        }
                        />

        if (rangeType === 'end' || rangeType === 'beginningAndEnd') {
            arrowOffset = 0.25*(width/widthInBps);
            width -= arrowOffset;
            arrow = (<path
                        transform={forward ?
                            `translate(${width},0)` :
                            `translate(${0.5*arrowOffset},0) scale(-1,1)`
                        }
                        d= {`M 0 ${halfwayPoint} L -18 ${halfwayPoint+6} L -18 ${halfwayPoint-6} Z`}
                        />
                    )
            width -= arrowOffset;
        }

        if (rangeType === 'start' || rangeType === 'beginningAndEnd') {
            circleOffset = 0.5*(width/widthInBps);
            width -= circleOffset;
            endCircle = circle;
        }

        var path = `
            M 0,${halfwayPoint+height/2}
            L ${width},${halfwayPoint+height/2}
            L ${width},${halfwayPoint-height/2}
            L 0,${halfwayPoint-height/2}
            z`

        width = width + 2*arrowOffset + circleOffset;
        var codonIndices = normalizedInternalStartCodonIndices.map(function (internalStartCodon,index) {
            var startBp = 0;
            if (forward && (rangeType === 'start' || rangeType === 'beginningAndEnd')) {
                var startBp = annotation.start % bpsPerRow;
            } else if (!forward && (rangeType === 'end' || rangeType === 'beginningAndEnd')) {
                var startBp = annotation.start % bpsPerRow;
            }
            let xShift = (internalStartCodon-startBp) * (width/widthInBps);
            return React.cloneElement(circle, {key: index, transform: `translate(${xShift+halfBpOffset},0)`});
        })

        return (
            <g
                id={annotation.id}
                key={'Orfs' + annotation.id}
                onClick={this.handleClick()}
                className={`veRowViewOrf clickable frame${frame}`}
                strokeWidth="2"
                stroke={ color}
                fill={ color }
                >

                <path
                    transform={forward ? `translate(${circleOffset},0)` : `translate(${width-circleOffset},0) scale(-1,1)`}
                    d={ path }
                    >
                </path>
                { codonIndices }
                { arrow }
                { endCircle }
            </g>
        );
    }
}
