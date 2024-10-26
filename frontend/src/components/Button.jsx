import React from 'react'

function Button({ loading = false, title = "button", onClick = _ => null , className="", disabled=false}) {
    return (
        <div className={`flex ${className}`}>
            {/* <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button> */}
            <button
                className={disabled ? 'disabled-button' : 'primary-button' }
                disabled={disabled}
                onClick={onClick}>{loading ? <span className="material-symbols-rounded">cycle</span> : title}</button>
        </div>
    )
}

export default Button