import React, { useState } from "react";
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
        <Button type="primary" onClick={addNewPot} className="hover-effect color-change">+Add New Pot</Button>
      </div>

      {isAddingPot && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>+Add New Pot</h1>
            <p className="modal-description">
              <small>
                Create a pot to set savings targets. These can help keep you on track as you save for special purchases.
              </small>
            </p>
            <label className="modal-label"><small>Pot Name</small></label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Rainy Days"
              value={newPotName}
              onChange={(e) => setNewPotName(e.target.value)} 
            />
            <label className="modal-label"> <small>Target Value $</small></label>
            <div className="input-wrapper">
              <input
                type="number"
                className="modal-input"
                placeholder=" $ e.g. 2000"
                value={newPotTarget}
                onChange={(e) => setNewPotTarget(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <Button type="primary" onClick={confirmNewPot} className="hover-effect color-change">Confirm</Button>
              <Button type="secondary" onClick={() => setIsAddingPot(false)} className="hover-effect color-change">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div id="pots-container">
        {data.pots.map((pot) => {
          const percentage = (pot.total * 100) / pot.target;

          const getColor = (percentage) => {
            if (percentage < 30) return "#FF6347";
            if (percentage < 70) return "#FFD700";
            return "#32CD32";
          };

          return (
            <Card key={`pot-${pot.id}`} title={pot.name} className="pot-card">
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
              <div className="percentage-label">{percentage.toFixed(0)}%</div>

              <div className="button-group">
                <Button onClick={() => openMoneyModal(pot.id, "add")} className="hover-effect color-change">Add money</Button>
                <Button type="secondary" onClick={() => openMoneyModal(pot.id, "withdraw")} className="hover-effect color-change">Withdraw money</Button>
                <Button type="danger" onClick={() => deletePot(pot.id)} className="hover-effect color-change">Delete</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {moneyModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {moneyModal.type === "withdraw"
                ? `Withdraw from '${data.pots.find(pot => pot.id === moneyModal.potId)?.name || "Pot"}'`
                : `Add to '${data.pots.find(pot => pot.id === moneyModal.potId)?.name || "Pot"}'`}
            </h2>

            <p>
              <small>
                {moneyModal.type === "withdraw"
                  ? "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
                  : "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."}
              </small>
            </p>

            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (data.pots.find(pot => pot.id === moneyModal.potId)?.total || 0) * 100 /
                      (data.pots.find(pot => pot.id === moneyModal.potId)?.target || 1)
                    }%`,
                    paddingTop: "0.5rem"
                  }}
                ></div>
              </div>
            </div>

            <label className="modal-label"><small>Amount to {moneyModal.type === "withdraw" ? "Withdraw" : "Add"}:</small></label>
            <input
              className="input-add"
              type="number"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              placeholder=" $ e.g. 2000"
            />
            <span className="progress-target" style={{ float: "right" }}>
              <small><small>Target of ${data.pots.find(pot => pot.id === moneyModal.potId)?.target || 0}</small></small>
            </span>
            <div className="clr" style={{ clear: "both" }}></div>

            <div className="modal-buttons">
              <Button type="primary" onClick={handleMoneyChange} className="hover-effect color-change">
                {moneyModal.type === "withdraw" ? "Confirm Withdrawal" : "Confirm Deposit"}
              </Button>
              <Button type="secondary" onClick={() => setMoneyModal({ visible: false, type: "", potId: null })} className="hover-effect color-change">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}