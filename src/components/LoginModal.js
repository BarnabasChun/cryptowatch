import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import firebase from '../firebase';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
};

const StyledModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  min-width: 400px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  box-shadow: -5px 8px 20px rgba(0, 0, 0, 0.6);
`;

const ModalTitle = styled(Typography)`
  text-transform: uppercase;
  &&& {
    margin-bottom: 20px;
  }
`;

const LoginModal = ({ isOpen, toggleModal, displayPromptText }) => {
  const firebaseAuth = firebase.auth();
  return (
    firebaseAuth && (
      <Modal open={isOpen} onClose={toggleModal}>
        <StyledModal>
          <ModalTitle variant="title">
            {displayPromptText
              ? 'To access this feature please login'
              : 'Select a provider to login'}
          </ModalTitle>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
        </StyledModal>
      </Modal>
    )
  );
};

export default LoginModal;
