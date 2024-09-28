import React, { useState } from "react";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For unique file names
import "./styles/payment.css";

const Payment: React.FC = () => {
  const location = useLocation();
  const { selectedSeats, totalPrice, paymentMethod } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    studentID: "",
    campusEmail: "",
    contactNo: "",
    receiptUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (info: any) => {
    console.log(info);
    const selectedFile = info.file;
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      message.error("Please upload a file of type PNG, JPG, or JPEG!");
    }
  };

  const handleConfirm = async () => {
    if (
      !formData.name ||
      !formData.studentID ||
      !formData.campusEmail ||
      !formData.contactNo ||
      !file
    ) {
      message.error(
        "Please fill in all fields and upload the payment receipt."
      );
      return;
    }

    try {
      // Upload the receipt image to Firebase Storage
      const storageRef = ref(storage, `receipts/${uuidv4()}_${file?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          message.error("Failed to upload receipt: " + error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, receiptUrl: downloadURL });

          // Save the form data to Firestore
          const docRef = doc(db, "payments", uuidv4());
          await setDoc(docRef, {
            ...formData,
            receiptUrl: downloadURL,
          });

          message.success("Payment details submitted successfully!");
          navigate("/success");
        }
      );
    } catch (error) {
      message.error("Error submitting form: " + error);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <label htmlFor="name">Name (as Per NRIC)</label>
      <Input
        id="name"
        placeholder="Name (as Per NRIC)"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="studentID">Student ID</label>
      <Input
        id="studentID"
        placeholder="Student ID"
        name="studentID"
        value={formData.studentID}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="campusEmail">Campus Email</label>
      <Input
        id="campusEmail"
        placeholder="Campus Email"
        name="campusEmail"
        value={formData.campusEmail}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="contactNo">Contact No.</label>
      <Input
        id="contactNo"
        placeholder="Contact No."
        name="contactNo"
        value={formData.contactNo}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="receipt">Payment Receipt</label>
      <Upload
        id="receipt"
        beforeUpload={() => false}
        onChange={handleFileChange}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Upload Payment Receipt</Button>
      </Upload>

      {/* {file && (
        <div>
          <h3>Uploaded Receipt:</h3>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Uploaded Receipt"
            style={{ maxWidth: "100%", marginTop: "20px" }}
          />
        </div>
      )} */}

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={handleConfirm}
          style={{ marginTop: "20px" }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Payment;
