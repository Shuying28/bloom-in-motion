import React, { useEffect, useState } from "react";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { firestore, imageStorage } from "../firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For unique file names
import "./styles/payment.css";
import "./styles/common.css";

interface formData {
  name: string;
  studentID: string;
  campusEmail: string;
  contactNo: string;
  receiptUrl: string;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const { selectedSeats, totalPrice, paymentMethod } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<formData>(() => {
    const storedFormData = sessionStorage.getItem("formData");
    return storedFormData
      ? JSON.parse(storedFormData)
      : {
          name: "",
          studentID: "",
          campusEmail: "",
          contactNo: "",
          receiptUrl: "",
        };
  });
  // const [file, setImageUpload] = useState<File | null>(() => {
  //   const storedFile = sessionStorage.getItem("file");
  //   return storedFile ? JSON.parse(storedFile) : null;
  // });
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const navigate = useNavigate();

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
    }

    return reservedSeats;
  };

  const checkCrashedSeats = () => {
    const crashedSeats = selectedSeats.filter((seat: string) =>
      reservedSeats.includes(seat)
    );
    if (crashedSeats.length > 0) {
      message.error(
        `The following seats have been reserved by others: ${crashedSeats.join(
          ", "
        )}`
      );
      navigate("/seatselection");
      sessionStorage.setItem("selectedSeats", JSON.stringify([]));
    }
  };

  useEffect(() => {
    // Retrieve reserved seats from Firestore
    const loadReservedSeats = async () => {
      const reserved = await fetchReservedSeats();
      setReservedSeats(reserved);
    };

    loadReservedSeats();

    sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // useEffect(() => {
  //   sessionStorage.setItem("file", JSON.stringify(file));
  // }, [file]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      /* If you're using Ant Design's Upload component, make sure you're correctly accessing the originFileObj from info.fileList when handling the upload.**/
      setImageUpload(info.fileList[0].originFileObj);
    } else {
      setImageUpload(null);
    }
  };

  const handleConfirm = async () => {
    if (
      !formData.name ||
      !formData.campusEmail ||
      !formData.contactNo ||
      !imageUpload
    ) {
      message.error(
        "Please fill in all the required fields and upload the payment receipt."
      );
      setIsLoading(false);
      return;
    }

    if (!selectedSeats || selectedSeats.length === 0) {
      message.error("No seats selected!");
      setIsLoading(false);
      return;
    }

    checkCrashedSeats();
    setIsLoading(true);
    try {
      // Step 1: Upload the receipt image to Firebase Storage using uploadBytes
      const imageRef = ref(
        imageStorage,
        `receipts/${imageUpload.name}_${uuidv4()}`
      );
      const metadata = {
        contentType: imageUpload.type,
      };
      const uploadResult = await uploadBytes(imageRef, imageUpload, metadata);

      // Step 2: Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(uploadResult.ref);
      setFormData({ ...formData, receiptUrl: downloadURL });

      // Step 3: Save the form data and uploaded receipt to Firestore
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
        navigate("/success", {
          state: {
            formData,
            selectedSeats,
            totalPrice,
            paymentMethod,
          },
        });
        sessionStorage.clear();
      } catch (firestoreError) {
        message.error("Error submitting form: " + firestoreError);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      message.error("Error submitting form: " + error);
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <label htmlFor="name">Name (as Per NRIC)*</label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="studentID">Student ID</label>
      <Input
        id="studentID"
        name="studentID"
        value={formData.studentID}
        onChange={handleInputChange}
      />
      <p className="remark">*only for XMUM students</p>
      <label htmlFor="campusEmail">Email*</label>
      <Input
        id="campusEmail"
        name="campusEmail"
        value={formData.campusEmail}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="contactNo">Contact No.*</label>
      <Input
        id="contactNo"
        name="contactNo"
        value={formData.contactNo}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <label htmlFor="receipt">Payment Receipt*</label>
      <Upload
        id="receipt"
        beforeUpload={(imageUpload) => {
          const validTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (!validTypes.includes(imageUpload.type)) {
            message.error("Please upload a file of type PNG, JPG, or JPEG!");
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        onRemove={() => {
          setImageUpload(null);
          // sessionStorage.setItem("file", "");
        }}
        onChange={handleFileChange}
        maxCount={1}
        showUploadList={{
          extra: ({ size = 0 }) => (
            <span style={{ color: "#cccccc" }}>
              ({(size / 1024 / 1024).toFixed(2)}MB)
            </span>
          ),
          showRemoveIcon: true,
          removeIcon: <DeleteOutlined style={{ color: "white" }} />,
        }}
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
          <span>Confirm</span>
        </Button>
      </div>
    </div>
  );
};

export default Payment;
