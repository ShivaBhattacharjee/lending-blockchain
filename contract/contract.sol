// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenizedStudentLoan {
    struct Loan {
        bytes32 loanId; 
        address sender;
        address receiver;
        uint256 amount;
        uint256 interestRate;
        uint256 balance;
        uint256 loanTerm; 
        bool isRepaid;
    }

    uint256 public loanCounter;
    mapping(bytes32 => Loan) public loans;
    mapping(address => bytes32[]) public borrowerLoans;

    event LoanIssued(bytes32 loanId, address sender, address receiver, uint256 amount, uint256 interestRate, uint256 loanTerm);
    event LoanRepaid(bytes32 loanId, uint256 amount);
    event LoanStatusChanged(bytes32 loanId, bool isRepaid);

    function issueLoan(address _receiver, uint256 _amount, uint256 _interestRate, uint256 _loanTerm) public returns (bytes32) {
        loanCounter++;
        bytes32 loanId = generateUUID(); 
        loans[loanId] = Loan(loanId, msg.sender, _receiver, _amount, _interestRate, _amount, _loanTerm, false);
        borrowerLoans[_receiver].push(loanId);
        emit LoanIssued(loanId, msg.sender, _receiver, _amount, _interestRate, _loanTerm);
        return loanId;
    }

    function repayLoan(bytes32 _loanId, uint256 _amount) public {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.receiver, "Only the receiver can repay the loan");
        require(loan.balance >= _amount, "Amount exceeds loan balance");
        require(!loan.isRepaid, "Loan is already repaid");

        loan.balance -= _amount;
        emit LoanRepaid(_loanId, _amount);

        if (loan.balance == 0) {
            loan.isRepaid = true;
            emit LoanStatusChanged(_loanId, true);
        }
    }

    function getLoanDetails(bytes32 _loanId) public view returns (Loan memory) {
        return loans[_loanId];
    }

    function checkBalance(bytes32 _loanId) public view returns (uint256) {
        return loans[_loanId].balance;
    }

    function getBorrowerLoans(address _borrower) public view returns (bytes32[] memory) {
        return borrowerLoans[_borrower];
    }

    function generateUUID() internal view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, msg.sender, loanCounter));
    }
}
