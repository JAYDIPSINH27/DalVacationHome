import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser, } from 'amazon-cognito-identity-js';
import {useLocation} from 'react-router-dom';

import userpool from './config/userpool';

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleVerification = () => {
    setVerificationError('');
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userpool
    });
    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setVerificationError(err.message || JSON.stringify(err));
        console.error('Verification error:', err);
        return;
      }
      console.log('Verification result:', result);
      
      // TODO: use axions instead fetch
      fetch(import.meta.env.VITE_APP_USER_STORE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      })
        .then(response => {
          if (response.ok) {
            console.log('User stored successfully');
            navigate('/login'); 
          } else {
            throw new Error('Failed to store user');
          }
        })
        .catch(error => {
          console.error('Error storing user:', error);
          setVerificationError('Failed to store user');
        });
    });

  };

  return (
    <div className="verify-email">
      <div className="form">
        <div className="formfield">
          <TextField
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            label="Verification Code"
            helperText={verificationError}
          />
        </div>
        <div className="formfield">
          <Button variant="contained" onClick={handleVerification}>Verify</Button>
        </div>
      </div>
    </div>
  );
};

export default Verification;