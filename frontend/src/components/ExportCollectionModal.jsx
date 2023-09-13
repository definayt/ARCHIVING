import React from 'react';

const ExportCollectionModal = ({ 
    hideModal, 
    confirmModal, 
    modalState, 
    dataIdNoBP, dataChangeNoBP,
    dataIdISBN, dataChangeISBN,
    dataIdTitle, dataChangeTitle,
    dataIdWriter, dataChangeWriter,
    dataId1stYear, dataChange1stYear,
    dataIdLastYear, dataChangeLastYear,
    dataIdAmount, dataChangeAmount,
    dataIdCategory, dataChangeCategory,
    dataIdStoryType, dataChengeStoryType,
    dataIdLanguage, dataChangeLanguage,
    dataIdDataDigital, dataChangeDataDigital

 }) => {
  if(!modalState) {
    return null;
  }
  return (
      <div className='modal is-active'>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Pilihan Kolom Export</p>
            <button
              onClick={hideModal}
              className="delete"
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdNoBP} onChange={(e) => dataChangeNoBP(e.target.checked)} />   Nomor BP
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdISBN} onChange={(e) => dataChangeISBN(e.target.checked)} />   ISBN
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdTitle} onChange={(e) => dataChangeTitle(e.target.checked)}/>   Judul
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdWriter} onChange={(e) => dataChangeWriter(e.target.checked)}/>   Penulis
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataId1stYear} onChange={(e) => dataChange1stYear(e.target.checked)}/>   Tahun Terbit Cetakan Pertama
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdLastYear} onChange={(e) => dataChangeLastYear(e.target.checked)}/>   Tahun Terbit Cetakan Terakhir
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdAmount} onChange={(e) => dataChangeAmount(e.target.checked)}/>   Jumlah Cetakan
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdCategory} onChange={(e) => dataChangeCategory(e.target.checked)}/>   Kategori
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdStoryType} onChange={(e) => dataChengeStoryType(e.target.checked)}/>   Jenis Cerita
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdLanguage} onChange={(e) => dataChangeLanguage(e.target.checked)}/>   Bahasa
                </label>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" checked={dataIdDataDigital} onChange={(e) => dataChangeDataDigital(e.target.checked)}/>   Data Digital
                </label>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button onClick={confirmModal} className="button is-success">Cetak</button>
            <button onClick={hideModal} className="button">Batal</button>
          </footer>
        </div>
      </div>
  )
}

export default ExportCollectionModal