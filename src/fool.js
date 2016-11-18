import React from 'react';
import ReactDOM from 'react-dom';

class Fool extends React.Component {
    render(){
        return (
            <div>Hey</div>
        )
    }
}

ReactDOM.render(<Fool />,document.getElementById('root'));
