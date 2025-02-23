import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useFinanceData } from "../../context/FinanceContext";
import "./PotsPage.css";

export default function PotsPage() {
  const { data, setData } = useFinanceData();
  const [isAddingPot, setIsAddingPot] = useState(false);
  const [newPotName, setNewPotName] = useState("");
  const [newPotTarget, setNewPotTarget] = useState("");
  const [moneyModal, setMoneyModal] = useState({ visible: false, type: "", potId: null });
  const [moneyAmount, setMoneyAmount] = useState("");

  const handleMoneyChange = () => {
    const { potId, type } = moneyModal;
    const amount = parseFloat(moneyAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setData((prevData) => ({
      ...prevData,
      pots: prevData.pots.map((pot) => {
        if (pot.id === potId) {
          if (type === "add") {
            return { ...pot, total: pot.total + amount };
          } else if (type === "withdraw" && pot.total >= amount) {
            return { ...pot, total: pot.total - amount };
          }
        }
        return pot;
      })
    }));

    setMoneyModal({ visible: false, type: "", potId: null });
    setMoneyAmount("");
  };

  const openMoneyModal = (id, type) => {
    setMoneyModal({ visible: true, type, potId: id });
  };

  const addNewPot = () => {
    setIsAddingPot(true);
  };

  const confirmNewPot = () => {
    if (!newPotName.trim() || isNaN(newPotTarget) || newPotTarget <= 0) return;
    const newPot = {
      id: Date.now(),
      name: newPotName,
      total: 0,
      target: Number(newPotTarget),
    };
    setData((prevData) => ({ ...prevData, pots: [...prevData.pots, newPot] }));
    setNewPotName("");
    setNewPotTarget("");
    setIsAddingPot(false);
  };

  const deletePot = (potId) => {
    setData((prevData) => ({
      ...prevData,
      pots: prevData.pots.filter((pot) => pot.id !== potId),
    }));
  };

  return (
    <div id="pots" role="tabpanel" aria-labelledby="tab-4" tabIndex="0">
      <div className="d-flex">
        <h2 className="section-title">Pots</h2>
        <Button type="primary" onClick={addNewPot}>Add New Pot</Button>
      </div>

      {isAddingPot && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Pot</h3>
            <input
              type="text"
              placeholder="Enter pot name"
              value={newPotName}
              onChange={(e) => setNewPotName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter target amount"
              value={newPotTarget}
              onChange={(e) => setNewPotTarget(e.target.value)}
            />
            <div className="modal-buttons">
              <Button type="primary" onClick={confirmNewPot}>Confirm</Button>
              <Button type="secondary" onClick={() => setIsAddingPot(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

<div id="pots-container">
  {data.pots.map((pot) => {
    const percentage = (pot.total * 100) / pot.target;

    const getColor = (percentage) => {
      if (percentage < 30) return "#FF6347"; // Red for low progress
      if (percentage < 70) return "#FFD700"; // Yellow for medium progress
      return "#32CD32"; // Green for high progress
    };

    return (
      <Card key={`pot-${pot.id}`} title={pot.name}>
        <div className="pot-details">
          <div className="pot-stat">
            <span className="txt-gray">Total saved</span>
            <b className="txt-size-xl">${pot.total}</b>
          </div>
          <div className="pot-stat">
            <span className="txt-gray">Target of</span>
            <b className="txt-size-xl">${pot.target}</b>
          </div>
        </div>

       

        <div
          role="meter"
          aria-valuenow={pot.total}
          aria-valuemin="0"
          aria-valuemax={pot.target}
          aria-label="Total saved"
          className="progress-meter"
        >
          <span
            style={{
              width: `${percentage}%`,
              backgroundColor: getColor(percentage),
            }}
            className="fill"
          ></span>
        </div>
		 {/* Percentage Number Positioned Below */}
		 <div className="percentage-label">{percentage.toFixed(0)}%</div>

        <div className="button-group">
          <Button onClick={() => openMoneyModal(pot.id, "add")}>Add money</Button>
          <Button type="secondary" onClick={() => openMoneyModal(pot.id, "withdraw")}>Withdraw money</Button>
          <Button type="danger" onClick={() => deletePot(pot.id)}>Delete</Button>
        </div>
      </Card>
    );
  })}
</div>


      {moneyModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter amount to {moneyModal.type}</h3>
            <input
              type="number"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              placeholder="Amount"
            />
            <div className="modal-buttons">
              <Button type="primary" onClick={handleMoneyChange}>Confirm</Button>
              <Button type="secondary" onClick={() => setMoneyModal({ visible: false, type: "", potId: null })}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
