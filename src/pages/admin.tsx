import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  InputRef,
  message,
  Space,
  Table,
  TableColumnsType,
  TableColumnType,
} from "antd";
import { firestore } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./styles/common.css";
import "./styles/admin.css";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

interface PaymentData {
  name: string;
  studentID: string;
  campusEmail: string;
  contactNo: string;
  selectedSeats: string[];
  paymentMethod: string;
  totalPrice: number;
  receiptUrl: string;
}

const Admin: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof PaymentData;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "payments"));
        const paymentsData = querySnapshot.docs.map(
          (doc) => doc.data() as PaymentData
        );
        setPayments(paymentsData);
      } catch (error) {
        if (error instanceof Error) {
          message.error(`Failed to fetch payment data: ${error.message}`);
        } else {
          message.error(
            "An unknown error occurred while fetching payment data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<PaymentData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space style={{ display: "flex", justifyContent: "end" }}>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => <SearchOutlined style={{ color: "white" }} />,
    onFilter: (value, record: PaymentData) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<PaymentData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Student ID",
      dataIndex: "studentID",
      key: "studentID",
      ...getColumnSearchProps("studentID"),
    },
    {
      title: "Email",
      dataIndex: "campusEmail",
      key: "campusEmail",
      ...getColumnSearchProps("campusEmail"),
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: "Selected Seats",
      dataIndex: "selectedSeats",
      key: "selectedSeats",
      render: (seats: string[]) => seats.join(", "),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `RM${price}`,
    },
    {
      title: "Receipt URL",
      dataIndex: "receiptUrl",
      key: "receiptUrl",
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View Receipt
        </a>
      ),
    },
  ];

  return (
    <div className="records-page">
      <h2>Payment Records</h2>
      <Table
        className="custom-table"
        loading={loading}
        dataSource={payments}
        columns={columns}
        rowKey="studentID"
        rowHoverable={false}
        scroll={{ x: 768 }}
      />
    </div>
  );
};

export default Admin;
