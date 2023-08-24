import React from 'react';

const LogoutConfirmation = ({ hideModal, confirmModal, modalState }) => {
  if(!modalState) {
    return null;
  }
  return (
      <div className='modal is-active'>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Konfirmasi Logout</p>
            <button
              onClick={hideModal}
              className="delete"
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
              Anda yakin ingin Logout?
            </div>
          </section>
          <footer className="modal-card-foot">
            <button onClick={confirmModal} className="button is-danger">Logout</button>
            <button onClick={hideModal} className="button">Batal</button>
          </footer>
        </div>
      </div>
  )
}

export default LogoutConfirmation