"use client";
import React, { useState, useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const contractAbi = [
  {
    inputs: [],
    name: "getAllLoans",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "loanId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "loanTerm",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isRepaid",
            type: "bool",
          },
        ],
        internalType: "struct TokenizedStudentLoan.Loan[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const GetAllLoansComponent: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllLoans = async () => {
    try {
      if (!isConnected) {
        throw new Error("User is not connected");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const loansData = await contract.getAllLoans();
      console.log(loansData);
      const formattedLoans = loansData.map((loan: any) => ({
        loanId: loan.loanId,
        sender: loan.sender,
        receiver: loan.receiver,
        amount: formatUnits(loan.amount, 18),
        interestRate: loan.interestRate.toString(),
        balance: formatUnits(loan.balance, 18),
        loanTerm: loan.loanTerm.toString(),
        isRepaid: loan.isRepaid,
      }));
      console.log(formattedLoans);
      setLoans(formattedLoans);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLoans();
  }, [isConnected]);

  return (
    <div className="overflow-x-scroll">
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        List of all Loans.
      </h2>
      {loading ? (
        <div className="flex justify-center">
          <ClipLoader color="white" />
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : loans.length > 0 ? (
        <Table className=" overscroll-x-scroll">
          <TableCaption>A list of all loans.</TableCaption>
          <TableHeader className=" overflow-x-scroll">
            <TableRow>
              <TableHead className="w-[100px]">Loan ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Amount (ETH)</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Loan Term</TableHead>
              <TableHead>Repaid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan, index) => (
              <TableRow key={index}>
                <TableCell className="truncate w-4">{loan.loanId}</TableCell>
                <TableCell className="truncate w-4">{loan.sender}</TableCell>
                <TableCell className="truncate w-4">{loan.receiver}</TableCell>
                <TableCell>{loan.balance}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>{loan.loanTerm}</TableCell>
                <TableCell>{loan.isRepaid ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Loans</TableCell>
              <TableCell>{loans.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <p>No loans found.</p>
      )}
    </div>
  );
};

export default GetAllLoansComponent;
