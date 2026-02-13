import React from 'react';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="text-center">
          <div className="spinner-custom mx-auto mb-3"></div>
          <p className="text-muted">{message}</p>
        </div>
        
        <style jsx>{`
          .loading-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(248, 250, 252, 0.95);
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <div className="spinner-custom mx-auto mb-3"></div>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default Loading;
