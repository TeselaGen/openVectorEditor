import React from 'react';
import DigestTool from './DigestTool';
import { connect } from "react-redux";

export class DigestToolDialog extends React.Component {
    render () {
        const {isOpen, dispatch, editorName} = this.props
        
        return <div>
        <Modal open={isOpen}>
            <DigestTool editorName={editorName}></DigestTool>
        </Modal>
        <button onClick={() => {
            dispatch && dispatch({
                type: 'OPEN_DIGEST_MODAL',
                meta: {
                    editorName
                }
            })
        }}>
            Simulate digestion
        </button>
        </div>
        
    }
}



export default connect((state, {editorName}) => {
    const editorState = state.VectorEditor[editorName]
    return {
        isOpen: editorState.isDigestToolOpen
    }
})(DigestToolDialog)