import React from 'react'

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col gap-10 items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="dot-spinner scale-175">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
            </div>

            <p className="text-white text-sm animate-pulse">Processing Image...</p>
        </div>
    )
}

export default Loader