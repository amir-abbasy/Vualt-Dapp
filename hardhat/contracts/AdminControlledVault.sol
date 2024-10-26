// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract AdminControlledVault {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        require(msg.value > 0, "Must deposit an amount greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Admin-triggered withdrawal on behalf of a user
    function adminWithdrawForUser(address user, uint256 amount) external onlyOwner {
        require(balances[user] >= amount, "Insufficient user balance");
        
        // Deduct from user balance and transfer funds to user
        balances[user] -= amount;
        payable(user).transfer(amount);
        
        emit Withdrawal(user, amount);
    }

    // Optional: allows the admin to withdraw all funds in case the contract is closed
    function closeVaultAndWithdrawAll() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Check contract balance for transparency
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
