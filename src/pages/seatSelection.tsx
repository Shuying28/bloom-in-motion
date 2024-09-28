import React, { useState } from "react";
import "./styles/seatSelection.css";
import { useNavigate } from "react-router-dom";

const SeatSelection: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();

  // from row 2 - 17
  const seatCounts = {
    2: 35, // Row 2: 35 seats
    3: 34, // Row 3: 34 seats
    4: 35, // Row 4: 35 seats
    5: 34, // Row 5: 34 seats
    6: 35, // Row 6: 35 seats
    7: 34, // Row 7: 34 seats
    8: 35, // Row 8: 35 seats
    9: 34, // Row 9: 34 seats
    10: 35, // Row 10: 35 seats
    11: 34, // Row 11: 34 seats
    12: 35, // Row 12: 35 seats
    13: 34, // Row 13: 34 seats
    14: 35, // Row 14: 35 seats
    15: 34, // Row 15: 34 seats
    16: 35, // Row 16: 35 seats
    17: 30, // Row 17: 30 seats
  };

  const zones = {
    A: { startRow: 2, endRow: 7, color: "red" },
    B: { startRow: 8, endRow: 12, color: "blue" },
    C: { startRow: 13, endRow: 17, color: "green" },
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
    for (let row = 2; row <= 17; row++) {
      const zone = Object.keys(zones).find(
        (key) =>
          row >= zones[key as keyof typeof zones].startRow &&
          row <= zones[key as keyof typeof zones].endRow
      );

      const seatRow = [];
      for (
        let seat = 1;
        seat <= seatCounts[row as keyof typeof seatCounts];
        seat++
      ) {
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
        <div style={{ display: "flex" }}>
          <span className="seat red"></span> Zone A
        </div>
        <div>
          <span className="seat blue"></span> Zone B
        </div>
        <div>
          <span className="seat green"></span> Zone C
        </div>
        <div>
          <span className="seat selected"></span> Selected
        </div>
        <div>
          <span className="seat reserved"></span> Occupied
        </div>
      </div>

      <div className="seat-info">
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
