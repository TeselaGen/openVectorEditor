import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
// import styles from '../RestrictionEnzymeManager/manager-list.scss';

// @Cerebral({
//     gelDigestEnzymes: ['gelDigestEnzymes'],
// })

export default class ActiveGelEnzymes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            signals,
            removeUserEnzyme,
            removeAllUserEnzymes,
            gelDigestEnzymes,
        } = this.props;

        return (
            <div>
                <List className={styles.managerListRight}>
                    {gelDigestEnzymes.map((enzyme, index) => (
                        <ListItem
                            key={index}
                            style={{maxHeight:'40px', fontSize:'11pt', verticalAlign:'middle', borderBottom:'1px solid #E0E0E0'}}
                            primaryText={enzyme}
                            rightIconButton={
                                <IconButton
                                    onTouchTap={function() {
                                        signals.editDigestEnzymes({currentUserList: gelDigestEnzymes,
                                            enzyme, action: "remove"});
                                    }}
                                    >
                                    <CloseIcon />
                                </IconButton>
                            }
                            />
                    ))}
                </List>

                <RaisedButton
                    className={styles.raisedPurpleButton}
                    label="Remove all"
                    primary
                    onTouchTap={function () {
                        signals.editDigestEnzymes({currentUserList: gelDigestEnzymes, action: "remove all"});
                    }}
                    />
            </div>
        );
    }
}
