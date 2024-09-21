import React, { useState } from "react";
import "./styles/seatSelection.css";
import { useNavigate } from "react-router-dom";

const SeatSelection: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();

  const rows = 17;
  const seatsPerRow = 30;
  const zones = {
    A: { startRow: 1, endRow: 5, color: "red" },
    B: { startRow: 6, endRow: 11, color: "blue" },
    C: { startRow: 12, endRow: 17, color: "green" },
  };

  const handleSeatClick = (zone: string, row: number, seat: number) => {
    const seatCode = `${zone}${row}-${seat < 10 ? `0${seat}` : seat}`;

    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((s) => s !== seatCode)
        : [...prev, seatCode]
    );
  };

  const renderSeats = () => {
    const seatRows = [];
    for (let row = 1; row <= rows; row++) {
      const zone = Object.keys(zones).find(
        (key) =>
          row >= zones[key as keyof typeof zones].startRow &&
          row <= zones[key as keyof typeof zones].endRow
      );

      const seatRow = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatCode = `${zone}${row}-${seat < 10 ? `0${seat}` : seat}`;
        const isSelected = selectedSeats.includes(seatCode);

        seatRow.push(
          <div
            key={seatCode}
            className={`seat ${zones[zone as keyof typeof zones].color} ${
              isSelected ? "selected" : ""
            }`}
            onClick={() => handleSeatClick(zone!, row, seat)}
          >
            {/* Render seat visual here */}
          </div>
        );
      }

      seatRows.push(
        <div key={row} className="seat-row">
          Row {row} {seatRow}
        </div>
      );
    }
    return seatRows;
  };

  return (
    <div className="seat-selection-page">
      <h2>Select Seats</h2>
      <div className="stage">STAGE</div>
      <div className="seating-chart">{renderSeats()}</div>

      <div className="legend">
        <div>
          <span className="red"></span> Zone A
        </div>
        <div>
          <span className="blue"></span> Zone B
        </div>
        <div>
          <span className="green"></span> Zone C
        </div>
        <div>
          <span className="yellow"></span> Selected
        </div>
        <div>
          <span className="gray"></span> Occupied
        </div>
      </div>

      <div className="selection-info">
        Seat(s) Selection: {selectedSeats.join(", ")}
      </div>

      <button
        className="next-button"
        disabled={selectedSeats.length === 0}
        onClick={() => navigate("/confirmTicket", { state: { selectedSeats } })}
      >
        Next
      </button>
    </div>
  );
};

export default SeatSelection;
