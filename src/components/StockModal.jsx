import PropTypes from 'prop-types';
import React, { useEffect, useCallback } from 'react';

const StockModal = ({ batchProduct, getTotalWeightNeeded, getTotalWeightEntered, setIsAllStocksSelected, batchProducts, selectedStocks, handleOnChange, setSelectedStocks, openModal, setOpenModal }) => {
    const allocateStock = useCallback(() => {
        if (!batchProduct || openModal !== batchProduct.id) return; // Ensure we only allocate stocks for the currently opened modal

        let totalWeightNeeded = getTotalWeightNeeded(batchProduct) - getTotalWeightEntered(batchProduct);
        if (totalWeightNeeded <= 0) return;

        setSelectedStocks((prevSelectedStocks) => {
            let updatedStocks = { ...prevSelectedStocks };
            let hasChanged = false;

            batchProduct.product.stocks.forEach((stock) => {
                const availableWeight = stock.total_weight - stock.total_sold_weight;
                const allocation = Math.min(totalWeightNeeded, availableWeight);

                if ((updatedStocks[batchProduct.product_id]?.[stock.id] || 0) !== allocation) {
                    hasChanged = true;
                    if (!updatedStocks[batchProduct.product_id]) {
                        updatedStocks[batchProduct.product_id] = {};
                    }
                    updatedStocks[batchProduct.product_id][stock.id] = allocation;
                }

                totalWeightNeeded -= allocation;
                if (totalWeightNeeded <= 0) return;
            });

            if (hasChanged) {
                setTimeout(() => {
                    setIsAllStocksSelected(batchProducts.every((batchProduct) => {
                        const requiredWeight = getTotalWeightNeeded(batchProduct);
                        const selectedWeight = getTotalWeightEntered(batchProduct);
                        return requiredWeight.toFixed(2) === selectedWeight.toFixed(2);
                    }));
                }, 0);

                return updatedStocks;
            } else {
                return prevSelectedStocks;
            }
        });
    }, [batchProduct, openModal, batchProducts, getTotalWeightNeeded, getTotalWeightEntered, setIsAllStocksSelected]);





    // Ensure allocation only happens when needed
    useEffect(() => {
        if (openModal === batchProduct.id) {
            allocateStock();
        }
    }, [openModal]);



    return (
        <div
            className="modal fade"
            id={`stockModal_${batchProduct.id}`}
            tabIndex="-1"
            aria-labelledby="stockModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-border-customized">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="stockModalLabel">
                            Stock(s) Selection & Weight Allocation for &nbsp;
                            <span className="text-warning fw-bold">{batchProduct.product.name}</span>
                        </h1>
                        <button type="button" onClick={() => setOpenModal(false)} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {batchProduct.product.stocks.length === 0 ? (
                            <p className="text-danger">No stock available for this product!</p>
                        ) : (
                            <>
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-warning">Stock date</th>
                                            <th scope="col" className="text-warning">Ingoing Stock Number</th>
                                            <th scope="col" className="text-warning">Weight Available (g)</th>
                                            <th scope="col" className="text-warning">Weight to Allocate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batchProduct.product.stocks
                                            .sort((a, b) => new Date(a.last_stock_date) - new Date(b.last_stock_date))
                                            .map((stock) => (
                                                <tr key={stock.id} className="col-sm-12">
                                                    <th className="col-sm-3">{stock.last_stock_date}</th>
                                                    <th className="col-sm-3">{stock.ingoing_batch_number}</th>
                                                    <td className="col-sm-3">
                                                        <input type="number" className="form-control" value={stock.total_weight - stock.total_sold_weight} disabled />
                                                    </td>
                                                    <td className="col-sm-3">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min={0}
                                                            max={stock.total_weight - stock.total_sold_weight}
                                                            value={selectedStocks[batchProduct.product_id]?.[stock.id] || ''}
                                                            className="form-control"
                                                            onChange={(e) => handleOnChange(e, stock)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="text-purple my-0">
                                            Total Weight Need to Allocate: {getTotalWeightNeeded(batchProduct)} g
                                        </p>
                                        <p className="text-purple my-0">
                                            Total Weight Allocated: {getTotalWeightEntered(batchProduct)} g
                                        </p>
                                        <p className="text-purple my-0" style={{ paddingTop: 10 }}>
                                            <b>Total Weight Remaining: {+getTotalWeightNeeded(batchProduct) - +getTotalWeightEntered(batchProduct)} g</b>
                                        </p>
                                        <p className="text-danger my-0">
                                            {getTotalWeightNeeded(batchProduct) !== getTotalWeightEntered(batchProduct) ? 'Allocate precise weight for submission' : null}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => setOpenModal(false)} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button
                            type="button"
                            className="btn btn-warning"
                            data-bs-dismiss="modal"
                            onClick={() => setOpenModal(false)}
                            disabled={getTotalWeightNeeded(batchProduct) !== getTotalWeightEntered(batchProduct)}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

StockModal.propTypes = {
    batchProduct: PropTypes.object,
    getTotalWeightNeeded: PropTypes.func,
    getTotalWeightEntered: PropTypes.func,
    handleStockWeight: PropTypes.func,
    handleOnChange: PropTypes.func,
    openModal: PropTypes.bool,
    setOpenModal: PropTypes.func,
    selectedStocks: PropTypes.object,
    setSelectedStocks: PropTypes.func,
    setIsAllStocksSelected: PropTypes.func,
    batchProducts: PropTypes.array,
};

export default StockModal;
