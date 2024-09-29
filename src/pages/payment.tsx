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
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For unique file names
import "./styles/payment.css";

const Payment: React.FC = () => {
  const location = useLocation();
  const { selectedSeats, totalPrice, paymentMethod } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[0]);
    } else {
      setFile(null);
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
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    try {
      // Upload the receipt image to Firebase Storage
      const storageRef = ref(storage, `receipts/${uuidv4()}_${file?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          message.error("Failed to upload receipt: " + error.message);
          setIsLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, receiptUrl: downloadURL });

          // Save the form data to Firestore
          const docRef = doc(firestore, "payments", uuidv4());
          try {
            await setDoc(docRef, {
              ...formData,
              receiptUrl: downloadURL,
              selectedSeats,
              totalPrice,
              paymentMethod,
            });
            message.success("Payment details submitted successfully!");
            navigate("/success");
          } catch (error) {
            // TODO: avoid "application/octet-stream" to be stored in the firestore anfd storage
            message.error("Error submitting form: " + error);
          } finally {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      message.error("Error submitting form: " + error);
      setIsLoading(false);
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
        beforeUpload={(file) => {
          const validTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (!validTypes.includes(file.type)) {
            message.error("Please upload a file of type PNG, JPG, or JPEG!");
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        onRemove={() => {
          setFile(null);
          console.log("File removed");
        }}
        onChange={handleFileChange}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Upload Payment Receipt</Button>
      </Upload>

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
          style={{ marginTop: "20px" }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Payment;
