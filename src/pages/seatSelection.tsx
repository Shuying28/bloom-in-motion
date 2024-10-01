import React, { useEffect, useState } from "react";
import "./styles/seatSelection.css";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./styles/common.css";

const SeatSelection: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const seatCounts = {
    2: 35,
    3: 34,
    4: 35,
    5: 34,
    6: 35,
    7: 34,
    8: 35,
    9: 34,
    10: 35,
    11: 34,
    12: 35,
    13: 34,
    14: 35,
    15: 34,
    16: 35,
    17: 30,
  };

  const zones = {
    A: { startRow: 2, endRow: 7, color: "red" },
    B: { startRow: 8, endRow: 12, color: "blue" },
    C: { startRow: 13, endRow: 17, color: "green" },
  };

  const earlyBirdPrices = {
    A: 30,
    B: 20,
    C: 15,
  };

  const normalPrices = {
    A: 35,
    B: 25,
    C: 20,
  };

  const fetchReservedSeats = async () => {
    const reservedSeats: string[] = [];

    try {
      const querySnapshot = await getDocs(collection(firestore, "payments"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservedSeats.push(...(data.selectedSeats || []));
      });
    } catch (error) {
      console.error("Error fetching reserved seats: ", error);
    } finally {
      setLoading(false);
    }

    return reservedSeats;
  };

  useEffect(() => {
    // Retrieve reserved seats from Firestore
    const loadReservedSeats = async () => {
      const reserved = await fetchReservedSeats();
      setReservedSeats(reserved);
    };

    loadReservedSeats();

    // Retrieve selectedSeats and totalPrice from session storage
    const storedSelectedSeats = sessionStorage.getItem("selectedSeats");
    const storedTotalPrice = sessionStorage.getItem("totalPrice");

    if (storedSelectedSeats) {
      setSelectedSeats(JSON.parse(storedSelectedSeats));
    }

    if (storedTotalPrice) {
      setTotalPrice(JSON.parse(storedTotalPrice));
    }
  }, []);

  const isEarlyBird = (): boolean => {
    const today = new Date();
    const earlyBirdStart = new Date(today.getFullYear(), 9, 2); // 2/10
    const earlyBirdEnd = new Date(today.getFullYear(), 9, 11); // 11/10

    return today >= earlyBirdStart && today <= earlyBirdEnd;
  };

  const currentPrices = isEarlyBird() ? earlyBirdPrices : normalPrices;

  const handleSeatClick = (zone: string, row: number, seat: number) => {
    const seatCode = `${zone}${row}-${seat < 10 ? `0${seat}` : seat}`;
    const isSelected = selectedSeats.includes(seatCode);

    let updatedSeats;
    let updatedPrice = totalPrice;

    if (isSelected) {
      // Remove seat and subtract its price
      updatedSeats = selectedSeats.filter((s) => s !== seatCode);
      updatedPrice -= currentPrices[zone as keyof typeof currentPrices];
    } else {
      // Add seat and its price
      updatedSeats = [...selectedSeats, seatCode];
      updatedPrice += currentPrices[zone as keyof typeof currentPrices];
    }

    setSelectedSeats(updatedSeats);
    setTotalPrice(updatedPrice);
    sessionStorage.setItem("selectedSeats", JSON.stringify(updatedSeats));
    sessionStorage.setItem("totalPrice", JSON.stringify(updatedPrice));
  };

  const generateSeatNumbers = (rowCount: number) => {
    const evenNumbers = [];
    const oddNumbers = [];

    // Generating seat numbers, even on the left, odd on the right
    for (let seat = rowCount; seat >= 1; seat--) {
      if (seat % 2 === 0) evenNumbers.push(seat);
      else oddNumbers.push(seat);
    }

    return [...evenNumbers, ...oddNumbers.reverse()];
  };

  const renderSeats = () => {
    const seatRows = [];
    for (let row = 2; row <= 17; row++) {
      const zone = Object.keys(zones).find(
        (key) =>
          row >= zones[key as keyof typeof zones].startRow &&
          row <= zones[key as keyof typeof zones].endRow
      );

      const seatNumbers = generateSeatNumbers(
        seatCounts[row as keyof typeof seatCounts]
      );

      const seatRow = seatNumbers.map((seatNum) => {
        const seatCode = `${zone}${row}-${
          seatNum < 10 ? `0${seatNum}` : seatNum
        }`;
        const isSelected = selectedSeats.includes(seatCode);
        const isReserved = reservedSeats.includes(seatCode);
        console.log(seatCode);
        console.log(isReserved);
        console.log(isSelected);

        return (
          <div
            key={seatCode}
            className={`seat ${zones[zone as keyof typeof zones].color} ${
              isSelected ? "selected" : ""
            } ${isReserved ? "reserved" : ""}`} // Add "reserved" class
            onClick={() => handleSeatClick(zone!, row, seatNum)}
            style={isReserved ? { cursor: "not-allowed" } : {}}
          >
            {seatNum}
          </div>
        );
      });

      seatRows.push(
        <div key={row} className="seat-row">
          <div className="row-label">Row {row}</div>
          <div className="seat-wrapper">{seatRow}</div>
        </div>
      );
    }
    return seatRows;
  };

  return (
    <div className="seat-selection-page">
      <h2>Select Seats</h2>
      <div className="stage">STAGE</div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="seating-chart">{renderSeats()}</div>
      )}

      <div className="legend">
        <div style={{ marginBottom: "20px" }}>
          <span className="seat red"></span> Zone A &nbsp; [RM
          {currentPrices["A"]}]
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span className="seat blue"></span> Zone B &nbsp; [RM
          {currentPrices["B"]}]
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span className="seat green"></span> Zone C &nbsp; [RM
          {currentPrices["C"]}]
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span className="seat selected"></span> Selected
        </div>
        <div style={{ marginBottom: "20px" }}>
          <span className="seat reserved"></span> Occupied
        </div>
      </div>

      <div className="seat-info">
        Seat(s) Selection: {selectedSeats.join(", ")}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="next-button"
          disabled={selectedSeats.length === 0}
          onClick={() =>
            navigate("/confirmTicket", {
              state: {
                selectedSeats,
                totalPrice,
              },
            })
          }
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
