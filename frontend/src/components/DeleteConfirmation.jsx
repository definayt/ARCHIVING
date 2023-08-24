import React from 'react';

const DeleteConfirmation = ({ hideModal, confirmModal, modalState, dataId }) => {
  if(!modalState) {
    return null;
  }
  return (
      <div className='modal is-active'>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Konfirmasi Hapus</p>
            <button
              onClick={hideModal}
              className="delete"
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
              Anda yakin ingin menghapus data ini?
            </div>
          </section>
          <footer className="modal-card-foot">
            <button onClick={() => confirmModal(dataId) } className="button is-danger">Hapus</button>
            <button onClick={hideModal} className="button">Batal</button>
          </footer>
        </div>
      </div>
  )
}

export default DeleteConfirmation