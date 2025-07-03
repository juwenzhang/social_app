"use client";
import React, { useState } from 'react';

export interface AlertProps {
  children: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info';
}

const Alert = (props: AlertProps) => {
  const { children, type } = props;
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <React.Fragment>
      {show && <div className='absolute top-0 right-0 w-1/4'>
        <div className={`alert alert-${type}`}>{children}
          <button onClick={handleClose}>X</button>
        </div>
      </div>}
    </React.Fragment>
  );
}

export default Alert;
