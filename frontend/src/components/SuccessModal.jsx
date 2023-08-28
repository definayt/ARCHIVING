import React from 'react';

const SuccessModal = ({ confirmModal, modalState, msg }) => {
  if(!modalState) {
    return null;
  }
  return (
      <div className='modal is-active'>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Berhasil</p>
           
          </header>
          <section className="modal-card-body">
            <div className="field">
              {msg}
            </div>
          </section>
          <footer className="modal-card-foot">
            <button onClick={confirmModal} className="button is-success">Oke</button>
          </footer>
        </div>
      </div>
  )
}

export default SuccessModal