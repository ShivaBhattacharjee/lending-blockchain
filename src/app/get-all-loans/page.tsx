"use client";
import React, { useState, useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { BrowserProvider, Contract, ethers, formatUnits } from "ethers";
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
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const contractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interestRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_loanTerm",
        type: "uint256",
      },
    ],
    name: "issueLoan",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "loanId",
        type: "bytes32",
      },
    ],
    name: "LoanDefaulted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "loanId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "interestRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "loanTerm",
        type: "uint256",
      },
    ],
    name: "LoanIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "loanId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LoanRepaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "loanId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isRepaid",
        type: "bool",
      },
    ],
    name: "LoanStatusChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
    ],
    name: "markAsDefaulted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "repayLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allLoanIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "borrowerLoans",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
    ],
    name: "checkBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
          {
            internalType: "bool",
            name: "isDefaulted",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "getBorrowerLoans",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
    ],
    name: "getLoanDetails",
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
          {
            internalType: "bool",
            name: "isDefaulted",
            type: "bool",
          },
        ],
        internalType: "struct TokenizedStudentLoan.Loan",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "loans",
    outputs: [
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
      {
        internalType: "bool",
        name: "isDefaulted",
        type: "bool",
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
      const filteredLoans = loansData.filter(
        (loan: any) => loan.sender === address || loan.receiver === address
      );
      const formattedLoans = filteredLoans.map((loan: any) => ({
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

  const [loanId, setLoanId] = useState<string>("");
  const [repayAmount, setRepayAmount] = useState<string>("");
  const [repayloading, setRepayLoading] = useState<boolean>(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  const abi = [
    // Include the ABI for the `repayLoan` function
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_loanId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "repayLoan",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    // Include any other necessary ABI entries
  ];

  const handleRepayLoan = async (e: React.FormEvent) => {
    console.log("Repay loan triggered");
    setRepayLoading(true);
    e.preventDefault();

    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.repayLoan(
        loanId,
        ethers.parseEther(repayAmount)
      );

      await tx.wait();
      alert("Loan repaid successfully!");

      // Clear form fields after successful submission
      setLoanId("");
      setRepayAmount("");
    } catch (err: any) {
      console.error(err);
      alert("Failed to repay loan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const [openRepayLoan, setOpenRepayLoan] = useState<boolean>(false);
  console.log(openRepayLoan);
  return (
    <div className="overflow-x-scroll min-h-screen relative">
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        List of all Loans.
      </h2>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <ClipLoader color="white" />
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : loans.length > 0 ? (
        <Table className="  overscroll-x-scroll">
          <TableCaption>A list of all loans.</TableCaption>
          <TableHeader className=" overflow-x-scroll">
            <TableRow>
              {/* <TableHead className="w-[100px]">Loan ID</TableHead> */}
              {/* <TableHead>Sender</TableHead> */}
              {/* <TableHead>Receiver</TableHead> */}
              <TableHead>Amount (ETH)</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Loan Term</TableHead>
              <TableHead>Repaid</TableHead>
              <TableHead>Repay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans
              .slice()
              .reverse()
              .map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.balance}</TableCell>
                  <TableCell>{loan.interestRate}</TableCell>
                  <TableCell>{loan.loanTerm}</TableCell>
                  <TableCell>{loan.isRepaid ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {loan.balance > 0 && (
                      <Button
                        onClick={() => {
                          setLoanId(loan.loanId);
                          setOpenRepayLoan(true); // Assuming you have a modal or similar
                        }}
                      >
                        Repay Loan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            <div
              className={` ${
                openRepayLoan ? "block" : "hidden"
              } w-full min-h-[400vh] absolute  top-20`}
            >
              <div className=" w-96 bg-black m-auto p-5 ">
                <X
                  className=" float-right mr-8 z-50 cursor-pointer"
                  onClick={() => setOpenRepayLoan(false)}
                />
                <CardContent>
                  <form onSubmit={handleRepayLoan}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="loanId">Loan ID</Label>
                        <Input
                          id="loanId"
                          type="text"
                          placeholder="0x..."
                          value={loanId}
                          onChange={(e) => setLoanId(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="repayAmount">
                          Repayment Amount (ETH)
                        </Label>
                        <Input
                          id="repayAmount"
                          type="text"
                          placeholder="0.5"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <CardFooter>
                      <Button type="submit" className=" mt-5">
                        {repayloading ? "Processing" : "Repay Loan"}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </div>
            </div>
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
