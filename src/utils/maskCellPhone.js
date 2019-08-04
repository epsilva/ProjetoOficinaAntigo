import React from 'react';
import MaskedInput from 'react-text-mask';


export default props => {

    const { inputRef, ...other } = props;

    return (
        <div>
            <MaskedInput
                {...other}
                ref={ref => {
                    inputRef(ref ? ref.inputElement : null);
                }}
                mask={['(',/\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholderChar={'\u2000'}
                showMask={false}
            />
        </div>
    );
}