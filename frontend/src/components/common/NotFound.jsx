import React from 'react'

const Notfound = ({ text }) => {
    return (
        <div className='col-12'>
            <div className='card shadow border-0 py-5 text-center'>
                <h4>{text ? text : 'Records Not Found!'}</h4>
                <p>We Couldn't find any matching records. Please adjust search or filters and try again.</p>
            </div>
        </div>
    )
}

export default Notfound