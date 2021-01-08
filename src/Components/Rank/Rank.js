import React from 'react'

export const Rank = ({name, entries}) => {
    return (
        <div>
            <div className="white f3">
                {`Welcome ${name}`}
            </div>
           
        </div>
    )
}

export default Rank

/*
 <div className="white f1">
    {`#${entries}`}
 </div>
*/