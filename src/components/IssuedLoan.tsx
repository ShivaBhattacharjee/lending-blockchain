"use client";
import React, { useState, useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { contractAbi } from "@/abi";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const IssuedLoansComponent: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssuedLoans = async () => {
    try {
      if (!isConnected) {
        throw new Error("User is not connected");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const loansData = await contract.getAllLoans();

      // Filter loans by sender address (issued by the connected user)
      const issuedLoans = loansData.filter(
        (loan: any) =>
          address && loan.sender.toLowerCase() === address.toLowerCase()
      );

      const formattedLoans = issuedLoans.map((loan: any) => ({
        loanId: loan.loanId,
        receiver: loan.receiver,
        amount: formatUnits(loan.amount, 18),
        interestRate: loan.interestRate.toString(),
        balance: formatUnits(loan.balance, 18),
        loanTerm: loan.loanTerm.toString(),
        isRepaid: loan.isRepaid,
        isDefaulted: loan.isDefaulted,
      }));

      setLoans(formattedLoans);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const markLoanAsDefaulted = async (loanId: string) => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const tx = await contract.markAsDefaulted(loanId);
      await tx.wait();
      alert("Loan marked as defaulted!");
      fetchIssuedLoans(); // Refresh loans data
    } catch (err: any) {
      console.error(err);
      alert("Failed to mark loan as defaulted: " + err.message);
    }
  };

  useEffect(() => {
    fetchIssuedLoans();
  }, [isConnected]);

  return (
    <div className="overflow-x-scroll">
      <h2 className="text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Issued Loans
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : loans.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Loan Term</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Repaid</TableCell>
              <TableCell>Defaulted</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.loanId}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.receiver}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.amount}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.interestRate}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.loanTerm}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.balance}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.isRepaid ? "Yes" : "No"}
                </TableCell>
                <TableCell
                  style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                >
                  {loan.isDefaulted ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  {!loan.isRepaid && !loan.isDefaulted && (
                    <Button onClick={() => markLoanAsDefaulted(loan.loanId)}>
                      Mark as Defaulted
                    </Button>
                  )}
                  {loan.isRepaid && (
                    <Button variant={"outline"}>Loan repaid</Button>
                  )}
                  {loan.isDefaulted && (
                    <Button variant={"destructive"}>Loan defaulted</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No issued loans found.</p>
      )}
    </div>
  );
};

export default IssuedLoansComponent;
